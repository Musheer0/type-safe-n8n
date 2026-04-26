import { GlobeIcon, MailIcon, MouseIcon, WebhookIcon } from "lucide-react"
import { BaseTriggerNode } from "../base-trig-node"

export const ManualNode = ()=>{


    return (
        <BaseTriggerNode
        type={"MANUAL_TRIGGER"}
        data={{
            label: "Manual Trigger",
            icon: MouseIcon
        }}
        />
    )
}