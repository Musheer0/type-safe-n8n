"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

// ---- ZOD SCHEMA ----
const emailSchema = z.object({
  to: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject required"),
  type: z.enum(["text", "html"]),
  content: z.string().min(1, "Content cannot be empty"),
})

const EmailForm = () => {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [type, setType] = useState<"text" | "html">("text")
  const [content, setContent] = useState("")

  // ---- VALIDATION ----
  useEffect(() => {
    const res = emailSchema.safeParse({
      to,
      subject,
      type,
      content,
    })

    if (res.success) {
      console.log("✅ Valid:", res.data)
    } else {
      console.log("❌ Errors:", res.error.flatten())
    }
  }, [to, subject, type, content])

  return (
    <div className="space-y-4">

      {/* TO */}
      <div className="space-y-1">
        <Label>To</Label>
        <Input
          placeholder="example@gmail.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {/* SUBJECT */}
      <div className="space-y-1">
        <Label>Subject</Label>
        <Input
          placeholder="What's this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {/* TYPE TOGGLE */}
      <div className="space-y-1">
        <Label>Content Type</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("text")}
            className={`px-3 py-1 rounded-md text-sm border ${
              type === "text"
                ? "bg-primary text-white"
                : "bg-background"
            }`}
          >
            Plain Text
          </button>

          <button
            type="button"
            onClick={() => setType("html")}
            className={`px-3 py-1 rounded-md text-sm border ${
              type === "html"
                ? "bg-primary text-white"
                : "bg-background"
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-1">
        <Label>
          {type === "html" ? "HTML Content" : "Message"}
        </Label>

        <Textarea
          placeholder={
            type === "html"
              ? "<h1>Hello</h1><p>This is styled</p>"
              : "Write your message..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[140px] font-mono text-xs"
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        {type === "html"
          ? "You are sending raw HTML (make sure tags are valid)"
          : "Plain text email (no styling)"}
      </p>
    </div>
  )
}

export default EmailForm