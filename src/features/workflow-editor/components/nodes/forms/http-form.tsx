"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { XIcon } from "lucide-react"

// ---- ZOD SCHEMA ----
const httpSchema = z.object({
  url: z.string().url("Invalid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
  headers: z.array(
    z.object({
      key: z.string().min(1, "Header key required"),
      value: z.string().min(1, "Header value required"),
    })
  ),
})
.superRefine((data, ctx) => {
  const hasBody = data.body && data.body.trim() !== ""

  // ❌ GET / DELETE should not have body
  if ((data.method === "GET" || data.method === "DELETE") && hasBody) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${data.method} should not have a body`,
      path: ["body"],
    })
  }

  // ✅ POST / PUT / PATCH can have body (optional still)
})

// ---- TYPES ----
type HeaderType = {
  key: string
  value: string
}

const HttpRequestForm = () => {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">("POST")
  const [body, setBody] = useState("")
  const [headers, setHeaders] = useState<HeaderType[]>([])
  const [showHeaders, setShowHeaders] = useState(false)

  // ---- HEADER HANDLERS ----
  const addHeader = () => {
    setShowHeaders(true)
    setHeaders((prev) => [...prev, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index)
    setHeaders(updated)

    if (updated.length === 0) {
      setShowHeaders(false)
    }
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const updated = [...headers]
    updated[index][field] = value
    setHeaders(updated)
  }

  // ---- METHOD CHANGE ----
  const handleMethodChange = (value: typeof method) => {
    setMethod(value)

    // 🚨 kill illegal body instantly
    if (value === "GET" || value === "DELETE") {
      setBody("")
    }
  }

  // ---- AUTO HEADER (optional but smart) ----
  useEffect(() => {
    if (body && method !== "GET" && method !== "DELETE") {
      const exists = headers.some(
        (h) => h.key.toLowerCase() === "content-type"
      )

      if (!exists) {
        setHeaders((prev) => [
          ...prev,
          { key: "Content-Type", value: "application/json" },
        ])
      }
    }
  }, [body])

  // ---- VALIDATION DEBUG ----
  useEffect(() => {
    const res = httpSchema.safeParse({
      url,
      method,
      body,
      headers,
    })

    if (res.success) {
      console.log("✅ Valid:", res.data)
    } else {
      console.log("❌ Errors:", res.error.flatten())
    }
  }, [url, method, body, headers])

  return (
    <div className="space-y-4">

      {/* URL */}
      <div className="space-y-1">
        <Label>Request URL</Label>
        <Input
          placeholder="https://api.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      {/* METHOD */}
      <div className="space-y-1">
        <Label>Method</Label>
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value as any)}
          className="w-full border rounded-md px-2 py-2 text-sm bg-background"
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* BODY (only when allowed) */}
      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <div className="space-y-1">
          <Label>Body</Label>
          <Textarea
            placeholder='{"hello":"world"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[120px] font-mono text-xs"
          />
        </div>
      )}

      {/* HEADERS */}
      <div className="space-y-2">
        <Button type="button" variant="outline" onClick={addHeader}>
          Add Header
        </Button>

        {showHeaders && headers.length > 0 && (
          <div className="space-y-2">
            {headers.map((header, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Header name"
                  value={header.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                />
                <Input
                  placeholder="Header value"
                  value={header.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(i)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Builds + validates HTTP request config (no send logic)
      </p>
    </div>
  )
}

export default HttpRequestForm