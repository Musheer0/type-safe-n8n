import { BaseExecutionNode } from "../base-exec-node"

export const DiscordNode = ()=>{


    return (
        <BaseExecutionNode
        type={"SEND_DISCORD_MSG"}
        data={{
            label: "Send Discord Message",
            icon: "/nodes/discord.svg"
        }}
        />
    )
}