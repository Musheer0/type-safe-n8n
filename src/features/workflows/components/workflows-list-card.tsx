"use client";
import { formatDistanceToNow } from "date-fns";
import { Globe, Lock, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WorkflowItem } from "./types";
import Link from "next/link";

interface WorkflowCardProps {
  workflow: WorkflowItem;
  index: number;
}

export const WorkflowCard = ({ workflow, index }: WorkflowCardProps) => (
 <Link href={`/workflows/${workflow.id}`}>

   <Card
    className="group flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer"
    style={{ animationDelay: `${index * 35}ms` }}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Workflow className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-sm">{workflow.name}</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              updated{" "}
              {formatDistanceToNow(new Date(workflow.updatedAt), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
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
      </div>
    </CardHeader>

    {workflow.description && (
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {workflow.description}
        </p>
      </CardContent>
    )}

    <CardFooter className="mt-auto pt-3 border-t">
      <p className="text-xs text-muted-foreground">
        Created{" "}
        {formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}
      </p>
    </CardFooter>
  </Card>
 </Link>
);
