import Editor from '@/features/workflow-editor/components/editor'
import WorkflowPageHeader from '@/features/workflows/components/workflow-page-header'
import WorkflowProvider from '@/features/workflows/components/workflow-provider'
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params

  return (
    <WorkflowProvider id={id}>
      <>
      <WorkflowPageHeader/>
      <Editor/>
      </>
    </WorkflowProvider>
  )
}

export default page