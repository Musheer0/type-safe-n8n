"use client";
import { formatDistanceToNow } from "date-fns";
import { Globe, Lock, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkflowItem } from "./types";
import Link from "next/link";

interface WorkflowRowProps {
  workflow: WorkflowItem;
}

export const WorkflowRow = ({ workflow }: WorkflowRowProps) => (
  <Link href={'/workflows/'+workflow.id} className="group flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-all duration-150 hover:border-primary/40 hover:bg-accent/30 cursor-pointer">
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
      {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
    </p>
  </Link>
);
