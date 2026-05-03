import type { NodeProps } from "@xyflow/react";
import { GlobeIcon, MailIcon } from "lucide-react";
import { BaseExecutionNode } from "../base-exec-node";
import EmailForm from "./forms/email-form";

export const EmailNode = (props: NodeProps) => {
  return (
    <BaseExecutionNode
      form={{
        form: <EmailForm />,
        title: "Send Email",
        description: "send email using your smpt pass and email",
        isSaving: false,
        onSave: () => {},
      }}
      type={"EMAIL"}
      data={{
        label: "send Email",
        icon: "/nodes/gmail.svg",
      }}
      props={props}
    />
  );
};
