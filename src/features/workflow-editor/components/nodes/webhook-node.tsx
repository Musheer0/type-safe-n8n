import { GlobeIcon, MailIcon, WebhookIcon } from "lucide-react"
import { BaseTriggerNode } from "../base-trig-node"

export const WebhookNode = ()=>{


    return (
        <BaseTriggerNode
        type={"WEBHOOK"}
        data={{
            label: "Webhook Event",
            icon: WebhookIcon
        }}
        />
    )
}