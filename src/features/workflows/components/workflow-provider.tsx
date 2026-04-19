"use client"

import { Workflow } from "@/generated/prisma/client"
import { createContext, useContext } from "react"

const context = createContext<Workflow|null|undefined>(null)

import React from 'react'
import { useWorkflow } from "../hooks/use-workflows"

const WorkflowProvider = ({id,children}:{id:string,children:React.ReactNode}) => {
   const {data,isPending} = useWorkflow(id)
  if(isPending) return <>Loading</>
  return (
    <context.Provider value={data}>
        {children}
    </context.Provider>
  )
}

export default WorkflowProvider
export const useActiveWorkflow = ()=>{
    const value = useContext(context)
    if(!value) throw new Error("useActiveWorkflow should be used inside workflow provider")
    return value
}