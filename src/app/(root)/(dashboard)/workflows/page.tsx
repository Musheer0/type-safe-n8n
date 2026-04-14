import { Button } from '@/components/ui/button'
import CreateWorkflowButton from '@/features/workflows/components/create-workflow-button'
import WorkflowsList from '@/features/workflows/components/workflows-list'
import React from 'react'

const pages = () => {
  return (
    <div>
      <CreateWorkflowButton loading={<Button>Loading</Button>}>
        <Button>New Workflow</Button>
      </CreateWorkflowButton>
      <WorkflowsList/>
    </div>
  )
}

export default pages