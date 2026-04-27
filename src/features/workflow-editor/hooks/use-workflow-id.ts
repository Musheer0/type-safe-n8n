"use client";

import { useParams } from "next/navigation";

export function useWorkflowId() {
  const params = useParams();

  // params.workflowId depends on your folder name
  const workflowId = params?.id as string | undefined;

  return workflowId;
}