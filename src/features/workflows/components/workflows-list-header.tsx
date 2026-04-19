"use client";
import {
  LayoutGrid,
  List,
  LoaderIcon,
  PlusIcon,
  Search,
  X,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWorkflowsListStore } from "@/features/workflows/store";
import CreateWorkflowButton from "./create-workflow-button";

export const WorkflowsListHeader = () => {
  const {search,setSearch, clearSearch } =
    useWorkflowsListStore();
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workflows…"
          className="pl-9 pr-9 h-auto! rounded-lg py-3"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              clearSearch();
              searchRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

     
      <CreateWorkflowButton
        loading={
          <Button disabled size={"lg"} className="rounded-lg">
            <LoaderIcon className="animate-spin" />
             <span className="sm:flex hidden">
           Creating Workflow
         </span>
          </Button>
        }
      >
        <Button size={"lg"} className="rounded-lg">
          <PlusIcon />
         <span className="sm:flex hidden">
           Create Workflow
         </span>
        </Button>
      </CreateWorkflowButton>
    </div>
  );
};
