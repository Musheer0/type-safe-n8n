import { BaseHandle } from "@/components/base-handle";
import { NodeType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { Position } from "@xyflow/react";
import { LucideIcon, SettingsIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import NodeDataForm, { nodedataformprops } from "./node-data-dialog";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "@/features/workflows/hooks/use-workflows";

type BaseExecutionNodeProps = {
  className?: string;
  type: NodeType;
  data: {
    label?: string;
    icon?: LucideIcon|string; // lucide icon OR custom component
  };
  form:{
        title:string,
        description?:string,
        form:React.ReactNode,
        onSave:()=>void,
        isSaving?:boolean
  }
};

export const BaseExecutionNode = memo(
  ({ className, data, type,form }: BaseExecutionNodeProps) => {
    
    return (
      <div
        className={cn(
          "bg-card text-card-foreground w-15 h-15 relative flex items-center justify-center rounded-xl border",
          "hover:ring-1",
          "in-[.selected]:border-muted-foreground",
          "in-[.selected]:shadow-lg",
          className
        )}
      >
        <NodeDataForm
        title={form.title}
        description={form.description}
        form={form.form}
        isSaving={form.isSaving}
        onSave={form.onSave}
        >
          <Button size={"icon"} variant={"link"} className="absolute bottom-full left-1/2 -translate-x-1/2"><SettingsIcon/></Button>
        </NodeDataForm>
        {/* LEFT (source) */}
        <BaseHandle id="source" type="source" position={Position.Left} />

        {/* ICON */}
        {data.icon ? (
        <>
        {typeof data.icon==="string" 
        ?
                  <img src={data.icon} alt="logo" className="w-7 h-7" />

        :
         <  data.icon/>
        }
        </>
        ) : (
          <img src="/logo.svg" alt="logo" className="w-7 h-7" />
        )}

        {/* LABEL */}
        {data.label && (
          <p className="absolute left-1/2 text-[10px] text-nowrap text-muted-foreground -translate-x-1/2 top-full">
            {data.label}
          </p>
        )}

        {/* RIGHT (target) */}
        <BaseHandle id="target" type="target" position={Position.Right} />
      </div>
    );
  }
);