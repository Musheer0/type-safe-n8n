import { GlobeIcon, MailIcon } from "lucide-react"
import { BaseExecutionNode } from "../base-exec-node"
import EmailForm from "./forms/email-form"

export const EmailNode = ()=>{


    return (
        <BaseExecutionNode
        form={{
            form:<EmailForm/>,
            title:"Send Email",
            description:"send email using your smpt pass and email",
        }}
        type={"EMAIL"}
        data={{
            label: "send Email",
            icon: "/nodes/gmail.svg"
        }}
        />
    )
}