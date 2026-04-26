import { NodeType } from "@/generated/prisma/enums"
import { GlobeIcon, LucideIcon, MouseIcon, WebhookIcon } from "lucide-react"
import React from "react"

export type NodeAction = (args: {
  data: object
  nodeData: object
}) => Promise<object>
export type nodeType =    "trigger"|"executor"
export type NodeUiData = {
    logo:LucideIcon|string,
    name:string,
    description?:string,
    type:nodeType
}


export type Nodes  = Record<NodeType,React.ReactNode>
export const nodeUIRegistry: Record<NodeType, NodeUiData> = {
    "EMAIL":{
        logo:"/nodes/gmail.svg",
        name:"Email",
        description:"send a email using your google app password",
        type:"executor"
    },
    "HTTP":{
        logo:GlobeIcon,
        name:"Http Request",
        description:"send a http request over the internet",
        type:"executor"
    },
    "MANUAL_TRIGGER":{
        logo:MouseIcon,
        name:"Manual Trigger",
        description:"manually trigger a workflow",
        type:"trigger"
    },
    "WEBHOOK":{
        logo:WebhookIcon,
        name:"Webhook Trigger",
        description:" trigger a workflow over a webhook request",
        type:"executor"
    }
}
// export const nodeActionRegistry: Record<NodeType, NodeAction> = {
//   EMAIL: 
// }