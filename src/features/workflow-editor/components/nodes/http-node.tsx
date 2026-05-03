import { GlobeIcon } from "lucide-react"
import { BaseExecutionNode } from "../base-exec-node"
import HttpRequestForm from "./forms/http-form"
import { NodeProps } from "@xyflow/react"

export const HttpNode = (props:NodeProps)=>{


    return (
        <BaseExecutionNode
        form={{
            form:<HttpRequestForm/>,
            title:"Send Http Request",
            isSaving:false,
            onSave:()=>{}
        }}
        type={"HTTP"}
        data={{
            label: "send a http request",
            icon: GlobeIcon
        }}
        props={props}
        />
    )
}