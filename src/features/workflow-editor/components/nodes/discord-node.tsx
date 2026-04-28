import { BaseExecutionNode } from "../base-exec-node"
import DiscordWebhookForm from "./forms/discord-form"

export const DiscordNode = ()=>{


    return (
        <BaseExecutionNode
        form={{
            form:<DiscordWebhookForm/>,
            title:"Send Discord Message",
            description:"Discord Webhook Url",
            isSaving:false,
            onSave:()=>{}
        }}

        type={"SEND_DISCORD_MSG"}
        data={{
            label: "Send Discord Message",
            icon: "/nodes/discord.svg"
        }}
        />
    )
}