import { create } from "zustand";

export type ViewMode = "grid" | "list";

export interface WorkflowItem {
  id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface WorkflowsListState {
  view: ViewMode;
  search: string;
  setView: (view: ViewMode) => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
}

export const useWorkflowsListStore = create<WorkflowsListState>((set) => ({
  view: "grid",
  search: "",
  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
}));
