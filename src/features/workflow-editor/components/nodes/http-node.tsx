import { GlobeIcon } from "lucide-react"
import { BaseExecutionNode } from "../base-exec-node"

export const HttpNode = ()=>{


    return (
        <BaseExecutionNode
        type={"HTTP"}
        data={{
            label: "send a http request",
            icon: GlobeIcon
        }}
        />
    )
}