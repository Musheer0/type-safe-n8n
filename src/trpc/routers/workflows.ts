import { getWorkflowById } from "@/features/workflows/data/get-workflow-by-id";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/db/prisma";
import { redis } from "@/lib/redis";
import { getWorkflowByIdKey } from "@/features/workflows/libs/redis-keys";
import { ExtractedEdgeSchema, ExtractedNodeSchema } from "@/features/workflows/schemas/transformed-data-schema";
import { nodeUIRegistry } from "@/features/workflow-editor/libs/node-registry";
import { Prisma } from "@/generated/prisma/client";

export const WorkflowsRoute = createTRPCRouter({
    getById: protectedProcedure.
    input(z.object({
        id:z.string(),
        data:z.boolean().optional()
    }))
    .query(async({ctx,input})=>{
        const userId = ctx.auth.userId;
        const workflow = await getWorkflowById(input.id)
        if(!workflow) throw new TRPCError({code:"NOT_FOUND"})
        if(workflow.user_id!==userId) throw new TRPCError({code:"NOT_FOUND"})
        if(!input.data) return workflow
        const nodes = await prisma.nodes.findMany({
            where:{
                workflow_id:workflow.id
            }
        })
        const edges = await prisma.edges.findMany({where:{
                workflow_id:workflow.id
            }})
        return {...workflow,nodes,edges}
    }),

    getAll :protectedProcedure
    .input(z.object({
        cursor:z.string().optional()
    }))
    .query(async({ctx,input})=>{
      const workflows = input.cursor?
      await prisma.workflow.findMany({
        where:{
            user_id:ctx.auth.userId
        },
        take:11,
        orderBy:{
            createdAt:"asc"
        },
        cursor:{
            id:input.cursor
        },
      }):
      await prisma.workflow.findMany({
        where:{
            user_id:ctx.auth.userId
        },
        take:11,
        orderBy:{
            createdAt:"desc"
        }
      });
      const cursor = workflows.length>10 ? workflows[10].id:null
      return {
        cursor,
        workflows:workflows.slice(0,9)
      }
    }),

    create: protectedProcedure
    .input(z.object({
        title:z.string().optional(),
        description:z.string().optional()
    }))
    .mutation(async({ctx,input})=>{
        const new_workflow = await prisma.workflow.create({
            data:{
                user_id:ctx.auth.userId,
                name:input.title||"untitled workflow",
                description:input.description
            }
        });
        await redis.set(getWorkflowByIdKey(new_workflow.id),new_workflow,{ex:60*60*24})
        return new_workflow
    }),
    rename: protectedProcedure
    .input(z.object({
        title:z.string().optional(),
        description:z.string().optional(),
        id:z.string()
    }))
    .mutation(async({ctx,input})=>{
        const updated_workflow = await prisma.workflow.update({
            where:{id:input.id,user_id:ctx.auth.userId},
            data:{
                user_id:ctx.auth.userId,
                name:input.title,
                description:input.description
            }
        });
        await redis.set(getWorkflowByIdKey(updated_workflow.id),updated_workflow,{ex:60*60*24})
        return updated_workflow
    }),
    
    delete: protectedProcedure
    .input(z.object({
        id:z.string()
    }))
    .mutation(async({ctx,input})=>{
       await prisma.workflow.delete({
        where:{
            id:input.id,
            user_id:ctx.auth.userId
        }
        });
        await redis.del(getWorkflowByIdKey(input.id))
        return null
    }),
    save:protectedProcedure
    .input(z.object({
        workflow_id:z.string(),
        nodes:z.array(ExtractedNodeSchema),
        edges:z.array(ExtractedEdgeSchema)
    }))
    .mutation(async({ctx,input})=>{
        const workflow = await prisma.workflow.findFirst({
            where:{
                id:input.workflow_id,
                user_id:ctx.auth.userId
            }
        })
        if(!workflow) throw new TRPCError({code:"NOT_FOUND"})
        if(input.nodes.length==0) return {success:true}
        
            // save nodes
        const nodevalues = input.nodes.map((n) => {
        const role = nodeUIRegistry[n.type].type.toUpperCase();
        return Prisma.sql`(
        ${n.id},
        ${input.workflow_id},
        ${n.name},
        ${n.type},
        ${role},    
        ${n.xCord},
        ${n.yCord},
        ${n.data}
        )`;});
         //save edges
        const edgevalues = input.edges.map((e)=>{
            return Prisma.sql`(
                ${e.id},
                ${input.workflow_id},
                ${e.fromNode},
                ${e.nextNode}
            )`
        });

      await prisma.$transaction(async (tx) => {

  // 🧹 DELETE NODES (missing ones)
  await tx.$executeRaw`
    DELETE FROM "Nodes"
    WHERE id NOT IN (${Prisma.join(input.nodes.map(n => n.id))})
  `

  // 📦 UPSERT NODES
  await tx.$executeRaw`
    INSERT INTO "Nodes"
    ("id", "workflow_id", "name", "type", "role", "xCord", "yCord", "data")
    VALUES ${Prisma.join(nodevalues)}
    ON CONFLICT ("id")
    DO UPDATE SET
      "xCord" = EXCLUDED."xCord",
      "yCord" = EXCLUDED."yCord",
      "data" = EXCLUDED."data"
  `

  // 🔗 EDGES (only if present)
  if (input.edges.length > 0) {

    await tx.$executeRaw`
      DELETE FROM "Edges"
      WHERE id NOT IN (${Prisma.join(input.edges.map(e => e.id))})
    `

    await tx.$executeRaw`
      INSERT INTO "Edges"
      ("id", "workflow_id", "fromNode", "nextNode")
      VALUES ${Prisma.join(edgevalues)}
      ON CONFLICT ("id")
      DO UPDATE SET
        "fromNode" = EXCLUDED."fromNode",
        "nextNode" = EXCLUDED."nextNode"
    `
  }

})

        return {success:true}
    })
})