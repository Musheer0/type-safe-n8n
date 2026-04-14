"use client";
import { AlertCircle, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWorkflows } from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsListStore } from "@/features/workflows/store";
import { WorkflowsListContent } from "./workflows-list-content";
import { WorkflowsListEmpty } from "./workflows-list-empty";
import { WorkflowsListHeader } from "./workflows-list-header";

const WorkflowsList = () => {
  const {
    workflows,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useWorkflows();

  const { search, clearSearch } = useWorkflowsListStore();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q),
    );
  }, [workflows, search]);

  if (error) {
    return (
      <div className="">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load workflows</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-1">
            <span>{error.message}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasNoWorkflows = workflows.length === 0;
  const hasNoResults = workflows.length > 0 && filtered.length === 0;

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5 sm:p-6 p-2">
        <WorkflowsListHeader />

        {search && (
          <p className="text-xs text-muted-foreground -mt-2">
            {filtered.length === 0
              ? "No workflows match your search"
              : `${filtered.length} workflow${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        )}

        {(hasNoWorkflows || hasNoResults && workflows===undefined) ? (
          <WorkflowsListEmpty
            hasWorkflows={!hasNoWorkflows}
            search={search}
            onClearSearch={clearSearch}
          />
        ) : (
          <>
            <WorkflowsListContent workflows={workflows} isLoading={isLoading} />

            {hasNextPage && !search && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Load more
                    </>
                  )}
                </Button>
              </div>
            )}

            {!hasNextPage && workflows.length > 0 && !search && (
              <>
                <Separator />
                <p className="text-center text-xs text-muted-foreground">
                  All {workflows.length} workflows loaded
                </p>
              </>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default WorkflowsList;
