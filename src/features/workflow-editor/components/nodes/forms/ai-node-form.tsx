"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

// ---- TYPES ----
type ModelOption = {
  label: string
  value: string
}

// ---- ZOD SCHEMA ----
const aiSchema = z.object({
  model: z.string().min(1, "Model required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt required"),
})

type Props = {
  models: ModelOption[]
}

const AiNodeForm = ({ models }: Props) => {
  const [model, setModel] = useState(models?.[0]?.value || "")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [userPrompt, setUserPrompt] = useState("")

  // ---- VALIDATION ----
  useEffect(() => {
    const res = aiSchema.safeParse({
      model,
      systemPrompt,
      userPrompt,
    })

    if (res.success) {
      console.log("✅ Valid:", res.data)
    } else {
      console.log("❌ Errors:", res.error.flatten())
    }
  }, [model, systemPrompt, userPrompt])

  return (
    <div className="space-y-4">

      {/* MODEL */}
      <div className="space-y-1">
        <Label>Model</Label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border rounded-md px-2 py-2 text-sm bg-background"
        >
          {models.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* SYSTEM PROMPT */}
      <div className="space-y-1">
        <Label>System Prompt</Label>
        <Textarea
          placeholder="You are a helpful assistant..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[100px] text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Controls AI behavior (tone, rules, personality)
        </p>
      </div>

      {/* USER PROMPT */}
      <div className="space-y-1">
        <Label>User Prompt</Label>
        <Textarea
          placeholder="Ask something..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="min-h-[120px] text-sm"
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        This builds AI request config (no execution here)
      </p>
    </div>
  )
}

export default AiNodeForm