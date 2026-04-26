import { GlobeIcon, MailIcon } from "lucide-react"
import { BaseExecutionNode } from "../base-exec-node"

export const EmailNode = ()=>{


    return (
        <BaseExecutionNode
        type={"EMAIL"}
        data={{
            label: "send Email",
            icon: "/nodes/gmail.svg"
        }}
        />
    )
}