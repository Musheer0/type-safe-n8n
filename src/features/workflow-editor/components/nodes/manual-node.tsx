import type { NodeProps } from "@xyflow/react";
import { GlobeIcon, MailIcon, MouseIcon, WebhookIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trig-node";

export const ManualNode = (props: NodeProps) => {
  return (
    <BaseTriggerNode
      type={"MANUAL_TRIGGER"}
      data={{
        label: "Manual Trigger",
        icon: MouseIcon,
      }}
      props={props}
    />
  );
};
