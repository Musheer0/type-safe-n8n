"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Trash2,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import type { WorkflowItem } from "./types";

interface WorkflowRowProps {
  workflow: WorkflowItem;
}

export const WorkflowRow = ({ workflow }: WorkflowRowProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="group flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-all duration-150 hover:border-primary/40 hover:bg-accent/30 cursor-pointer">
        <Link
          href={"/workflows/" + workflow.id}
          className="flex flex-1 items-center gap-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Workflow className="h-3.5 w-3.5" />
          </div>

          <div className="flex flex-1 flex-col min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {workflow.name}
            </p>
            {workflow.description && (
              <p className="truncate text-xs text-muted-foreground">
                {workflow.description}
              </p>
            )}
          </div>

          <Badge
            variant={workflow.is_public ? "default" : "secondary"}
            className={`shrink-0 gap-1 text-xs ${
              workflow.is_public
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                : ""
            }`}
          >
            {workflow.is_public ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </Badge>

          <p className="shrink-0 text-xs text-muted-foreground hidden sm:block">
            {formatDistanceToNow(new Date(workflow.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setRenameOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setDeleteOpen(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RenameDialog
        id={workflow.id}
        prev={{
          name: workflow.name,
          description: workflow.description ?? null,
        }}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteDialog
        id={workflow.id}
        name={workflow.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
