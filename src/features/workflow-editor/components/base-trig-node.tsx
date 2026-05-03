import { BaseHandle } from "@/components/base-handle";
import { NodeType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { NodeProps, Position } from "@xyflow/react";
import { LucideIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import NodeDataForm, { nodedataformprops } from "./node-data-dialog";
import { Button } from "@/components/ui/button";
import { useEditor } from "../stores/node-store";

type BaseExecutionNodeProps = {
  className?: string;
  type: NodeType;
  data: {
    label?: string;
    icon?: LucideIcon|string; // lucide icon OR custom component
  };
    form?:{
          title:string,
          description?:string,
          form:React.ReactNode,
          onSave:()=>void,
          isSaving?:boolean
    },
      props:NodeProps
};

export const BaseTriggerNode = memo(
  ({ className, data, type,form ,props}: BaseExecutionNodeProps) => {
    const {deleteNode} = useEditor()
    return (
      <div
        className={cn(
          "bg-card text-card-foreground w-15 h-15 relative flex items-center  justify-center rounded-xl rounded-r-none! border",
          "hover:ring-1",
          "in-[.selected]:border-muted-foreground",
          "in-[.selected]:shadow-lg",
          className
        )}
      >
           <div className="flex  absolute bottom-full justify-center w-full py-3 left-0 items-center gap-2">
         {form &&
        <>
          <NodeDataForm
        title={form.title}
        description={form.description}
        form={form.form}
        isSaving={false}
        onSave={()=>{}}
        >
          <Button size={"icon"} variant={"link"} className=""><SettingsIcon/></Button>
        </NodeDataForm>
        </>
        }
        <button onClick={()=>{deleteNode(props.id)}} className="text-destructive">
          <TrashIcon size={14}/>
        </button>
     </div>
       
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