import { GlobeIcon } from "lucide-react"
import { BaseExecutionNode } from "../base-exec-node"
import HttpRequestForm from "./forms/http-form"

export const HttpNode = ()=>{


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
        />
    )
}