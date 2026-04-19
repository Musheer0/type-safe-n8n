import { getWorkflowById } from "@/features/workflows/data/get-workflow-by-id";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/db/prisma";
import { redis } from "@/lib/redis";
import { getWorkflowByIdKey } from "@/features/workflows/libs/redis-keys";

export const WorkflowsRoute = createTRPCRouter({
    getById: protectedProcedure.
    input(z.object({
        id:z.string()
    }))
    .query(async({ctx,input})=>{
        const userId = ctx.auth.userId;
        const workflow = await getWorkflowById(input.id)
        if(!workflow) throw new TRPCError({code:"NOT_FOUND"})
        if(workflow.user_id!==userId) throw new TRPCError({code:"NOT_FOUND"})
        return workflow
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
})