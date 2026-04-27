import { GlobeIcon, MailIcon, WebhookIcon } from "lucide-react"
import { BaseTriggerNode } from "../base-trig-node"
import WebhookForm from "./forms/webhook-form"

export const WebhookNode = ()=>{


    return (
        <BaseTriggerNode
        form={{
            form:<WebhookForm />,
            description:"Send POST requests to this endpoint to trigger your workflow",
            onSave:()=>{},
            title:"Webhook URL"

        }}

        type={"WEBHOOK"}
        data={{
            label: "Webhook Event",
            icon: WebhookIcon
        }}
        />
    )
}