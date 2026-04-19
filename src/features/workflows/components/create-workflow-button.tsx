"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

const CreateWorkflowButton = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: React.ReactNode;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useMutation(
    trpc.workflows.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onMutate: () => {
        toast.loading("creating workflow");
      },
      onSuccess: (newWorkflow) => {
        toast.dismiss();
        toast.success("Created workflow");

        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getAll.queryKey(),
        });
        router.push(`/workflows/${newWorkflow.id}`);
        setOpen(false);
        setTitle("");
        setDescription("");
      },
    }),
  );

  const handleSubmit = () => {
    mutate({
      title: title || undefined,
      description: description || undefined,
    });
  };

  if (isPending) return loading;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Workflow</AlertDialogTitle>
          <AlertDialogDescription>
            Give your new workflow a name and an optional description.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workflow-title">Title</Label>
            <Input
              id="workflow-title"
              placeholder="Untitled workflow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workflow-description">
              Description{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="workflow-description"
              placeholder="What does this workflow do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateWorkflowButton;
