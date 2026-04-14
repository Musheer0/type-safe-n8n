"use client"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

const   CreateWorkflowButton = ({
  children,
  loading,
}: {
  children: React.ReactNode
  loading: React.ReactNode
}) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { mutate, isPending } = useMutation(
    trpc.workflows.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message)
      },
      onMutate:()=>{
        toast.loading('creating workflow')
      },
      onSuccess: (newWorkflow) => {
        toast.dismiss()
        toast.success('Created workflow')

        // Update the React Query cache for the getAll query
        // The getAll query key from tRPC
        queryClient.setQueriesData(
          trpc.workflows.getAll.queryFilter(),
          (oldData: { pages: { cursor: string | null; workflows: typeof newWorkflow[] }[] } | undefined) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page, index) => {
                // Prepend to the first page
                if (index === 0) {
                  return {
                    ...page,
                    workflows: [newWorkflow, ...page.workflows],
                  }
                }
                return page
              }),
            }
          }
        )
        setOpen(false)
        setTitle('')
        setDescription('')
      },
    })
  )

  const handleSubmit = () => {
    mutate({ title: title || undefined, description: description || undefined })
  }

  if (isPending) return loading

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
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workflow-description">
              Description{' '}
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
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateWorkflowButton