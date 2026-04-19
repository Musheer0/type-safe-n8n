"use client";
import { useMemo } from "react";
import {
  useWorkflowsListStore,
  type WorkflowItem,
} from "@/features/workflows/store";
import { WorkflowRow } from "./workflows-list-row";

interface WorkflowsListContentProps {
  workflows: WorkflowItem[];
  isLoading: boolean;
}

export const WorkflowsListContent = ({
  workflows,
  isLoading,
}: WorkflowsListContentProps) => {
  const { search } = useWorkflowsListStore();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q),
    );
  }, [workflows, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3"
          >
            <div className="h-8 w-8 shrink-0 rounded-lg bg-muted animate-pulse" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filtered.map((workflow) => (
        <WorkflowRow key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};
