"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WebhookIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DiscordWebhookForm = () => {
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

 
  return (
    <div className="space-y-4">

      {/* Webhook URL */}
      <div className="space-y-1">
        <Label>Discord Webhook URL</Label>
        <Input
          placeholder="https://discord.com/api/webhooks/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      {/* Message */}
      <div className="space-y-1">
        <Label>Message</Label>
        <Textarea
          placeholder="Type something unhinged..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] text-sm"
        />
      </div>

   
     
    </div>
  )
}

export default DiscordWebhookForm