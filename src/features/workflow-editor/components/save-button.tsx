"use client"
import React from 'react'
import { useWorkflowId } from '../hooks/use-workflow-id'
import { useEditor } from '../stores/node-store'
import { ExtractImpDataFromEdges, ExtractImpDataFromNodes } from '../libs/transform-data'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { SaveIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const SaveButton = () => {
    const workflowId = useWorkflowId()
    const { nodes, edges } = useEditor()
    const trpc = useTRPC()

    const { mutate, isPending } = useMutation({
        ...trpc.workflows.save.mutationOptions({}),
        onSuccess: () => {
            toast.success('Workflow saved', {
                description: 'Your changes have been saved successfully.',
            })
        },
        onError: (error) => {
            toast.error('Failed to save', {
                description: error?.message ?? 'Something went wrong. Please try again.',
            })
        },
    })

    const handleSave = () => {
        if (!workflowId) {
            toast.warning('No workflow selected', {
                description: 'Please open a workflow before saving.',
            })
            return
        }

        const transformed_nodes = ExtractImpDataFromNodes(nodes as any)
        const transformed_edges = ExtractImpDataFromEdges(edges)

        mutate({
            nodes: transformed_nodes,
            edges: transformed_edges,
            workflow_id: workflowId,
        })
    }

    return (
        <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
                <Loader2 className="animate-spin" />
            ) : (
                <SaveIcon />
            )}
            {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
    )
}

export default SaveButton