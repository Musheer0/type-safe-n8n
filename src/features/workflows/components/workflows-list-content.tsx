"use client";
import { useMemo } from "react";
import {
  useWorkflowsListStore,
  type WorkflowItem,
} from "@/features/workflows/store";
import { WorkflowCard } from "./workflows-list-card";
import { WorkflowRow } from "./workflows-list-row";
import { SkeletonCard, SkeletonRow } from "./workflows-list-skeletons";

interface WorkflowsListContentProps {
  workflows: WorkflowItem[];
  isLoading: boolean;
}

export const WorkflowsListContent = ({
  workflows,
  isLoading,
}: WorkflowsListContentProps) => {
  const { view, search, clearSearch } = useWorkflowsListStore();

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((workflow, i) => (
          <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
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
