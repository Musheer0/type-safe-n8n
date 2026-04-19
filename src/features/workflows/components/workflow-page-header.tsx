"use client";
import { UserButton } from "@clerk/nextjs";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { useActiveWorkflow } from "./workflow-provider";

const WorkflowPageHeader = () => {
  const { name, id, description } = useActiveWorkflow();
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <nav className="w-full px-2 flex items-center justify-between py-3 border-b">
      <div className="left flex items-center gap-2">
        <Button
          onClick={() => {
            router.back();
          }}
          variant={"ghost"}
        >
          <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
        </Button>
        <p className="font-semibold capitalize">{name}</p>
      </div>

      <div className="right">
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action
              label="Rename Workflow"
              labelIcon={<Pencil className="mr-2 h-4 w-4" />}
              onClick={() => setRenameOpen(true)}
            />
            <UserButton.Action
              label="Delete Workflow"
              labelIcon={<Trash2 className="mr-2 h-4 w-4" />}
              onClick={() => setDeleteOpen(true)}
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>

      <RenameDialog
        id={id}
        prev={{
          name: name,
          description: description ?? null,
        }}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteDialog
        id={id}
        name={name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </nav>
  );
};

export default WorkflowPageHeader;
