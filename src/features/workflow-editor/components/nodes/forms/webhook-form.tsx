"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWorkflowId } from '@/features/workflow-editor/hooks/use-workflow-id'
import { CopyIcon, CheckIcon, WebhookIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const WebhookForm = () => {
    const workflow_id = useWorkflowId()
  const webhook_url =
    window.location.hostname + "/api/" + workflow_id + "/triggers/webhook"
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(webhook_url)
    setCopied(true)
    toast.success("Webhook URL copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className=" space-y-4">

      {/* URL row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="text-xs text-muted-foreground font-mono select-none">POST</span>
          </div>
          <Input
            readOnly
            value={webhook_url}
            className="pl-12 pr-3 font-mono text-xs bg-background text-foreground truncate cursor-default focus-visible:ring-1"
          />
        </div>
        <Button
          size="sm"
          variant={copied ? "default" : "outline"}
          className="shrink-0 gap-1.5 transition-all duration-200"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-muted-foreground">
        Workflow ID: <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">{workflow_id}</code>
      </p>
    </div>
  )
}

export default WebhookForm