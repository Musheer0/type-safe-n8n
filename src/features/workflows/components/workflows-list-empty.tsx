"use client";
import { Search, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasWorkflows: boolean;
  search: string;
  onClearSearch: () => void;
}

export const WorkflowsListEmpty = ({
  hasWorkflows,
  search,
  onClearSearch,
}: EmptyStateProps) => {
  if (!hasWorkflows) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Workflow className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium">No workflows yet</p>
        <p className="text-xs text-muted-foreground">
          Create your first workflow to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Search className="h-8 w-8 text-muted-foreground/40" />
      <p className="text-sm font-medium">No results for "{search}"</p>
      <Button
        variant="link"
        size="sm"
        onClick={onClearSearch}
        className="text-xs h-auto p-0"
      >
        Clear search
      </Button>
    </div>
  );
};
