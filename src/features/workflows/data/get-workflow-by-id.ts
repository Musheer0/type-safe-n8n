import { redis } from "@/lib/redis"
import { getWorkflowByIdKey } from "../libs/redis-keys"
import { Workflow } from "@/generated/prisma/client"
import prisma from "@/db/prisma"

export const getWorkflowById = async(id:string)=>{
    const cache = await redis.get<Workflow>(getWorkflowByIdKey(id))
    if(cache) return cache
    const workflow = await prisma.workflow.findUnique({where:{id}})
    if(workflow)await redis.set(getWorkflowByIdKey(id),workflow,{ex:60*60*24})
    return workflow
}