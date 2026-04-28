# 📦 Workflow Editor — Custom Node Guide

This guide explains how to create and register a custom node in the workflow editor.

---

## 🧠 Overview

A **node** is a building block in the workflow system.

Each node has 3 main parts:

* **UI Metadata** → how it appears in the editor
* **Node Component** → how it renders in the canvas
* **Node Action** → what it actually does during execution

---

## 🧩 Architecture

```txt
Prisma Enum (NodeType)
        ↓
nodeUIRegistry (Sidebar UI)
        ↓
Node Component (Canvas)
        ↓
Node Form (User Input)
        ↓
nodeTypes (Renderer Mapping)
        ↓
nodeActionRegistry (Execution Logic)
```

---

## 🚀 Step-by-Step Setup

---

### 1. Add Node Type (Database Layer)

File: `prisma/schema.prisma`

```prisma
enum NodeType {
  EMAIL
  HTTP
  MANUAL_TRIGGER
  WEBHOOK
  SEND_DISCORD_MSG
  YOUR_NEW_NODE
}
```

Run:

```bash
npx prisma generate
```

---

### 2. Register Node UI

File:
`@/features/workflow-editor/libs/node-registry.ts`

```ts
YOUR_NEW_NODE: {
  logo: GlobeIcon, // or "/nodes/custom.svg"
  name: "My Node",
  description: "does something useful",
  type: "executor" // "trigger" | "executor"
}
```

#### Fields

| Field         | Type                      | Description          |
| ------------- | ------------------------- | -------------------- |
| `logo`        | `LucideIcon \| string`    | Icon or image path   |
| `name`        | `string`                  | Display name         |
| `description` | `string`                  | Optional helper text |
| `type`        | `"trigger" \| "executor"` | Node category        |

---

### 3. Create Node Component

Path:
`@/features/workflow-editor/components/nodes/your-node.tsx`

```tsx
import { BaseExecutionNode } from "../base-exec-node"
import YourForm from "./forms/your-form"
import { GlobeIcon } from "lucide-react"

export const YourNode = () => {
  return (
    <BaseExecutionNode
      form={{
        form: <YourForm />,
        title: "My Node",
        isSaving: false,
        onSave: () => {}
      }}
      type={"YOUR_NEW_NODE"}
      data={{
        label: "does something useful",
        icon: GlobeIcon
      }}
    />
  )
}
```

---

### 4. Create Node Form

Path:
`@/features/workflow-editor/components/nodes/forms/your-form.tsx`

```tsx
const YourForm = () => {
  return (
    <div>
      <input placeholder="Enter value..." />
    </div>
  )
}

export default YourForm
```

---

### 5. Register Node in Renderer

File:
`node-registry.ts`

```ts
import { YourNode } from '@/features/workflow-editor/components/nodes/your-node';

export const nodeTypes = {
  http: HttpNode,
  email: EmailNode,
  webhook: WebhookNode,
  discord: DiscordNode,
  manual: ManualNode,
  yourNode: YourNode
};
```

---

### 6. Add Execution Logic

File:
`node-registry.ts`

```ts
export const nodeActionRegistry: Record<NodeType, NodeAction> = {
  EMAIL: async () => {},

  YOUR_NEW_NODE: async ({ data, nodeData }) => {
    // your logic here

    return {
      success: true
    }
  }
}
```

---

## ⚙️ Types Reference

```ts
export type NodeAction = (args: {
  data: object
  nodeData: object
}) => Promise<object>

export type nodeType = "trigger" | "executor"

export type NodeUiData = {
  logo: LucideIcon | string
  name: string
  description?: string
  type: nodeType
}
```

---

## 🧠 Key Concepts

### NodeType (Prisma Enum)

Defines all valid node types globally.

### nodeUIRegistry

Controls how nodes appear in the sidebar.

### nodeTypes

Maps node keys → React components.

### nodeActionRegistry

Defines runtime behavior of nodes.

---

## 🚨 Common Issues

| Problem                  | Cause                           |
| ------------------------ | ------------------------------- |
| Node not visible         | Not added to `nodeUIRegistry`   |
| Drag works but no render | Missing in `nodeTypes`          |
| Execution fails          | Missing in `nodeActionRegistry` |
| Type errors              | Forgot `prisma generate`        |
| Node not saving          | Broken `onSave` handler         |

---

## 🧪 Minimal Working Checklist

* [ ] Added enum in Prisma
* [ ] Ran `prisma generate`
* [ ] Added to `nodeUIRegistry`
* [ ] Created node component
* [ ] Created form
* [ ] Registered in `nodeTypes`
* [ ] Added action in `nodeActionRegistry`

---

## 🏁 Result

After setup:

* Node appears in sidebar ✅
* Drag & drop works ✅
* Config UI works ✅
* Execution works ✅

---

## 🔮 Next Steps

You can extend nodes with:

* Validation (Zod / React Hook Form)
* Async execution
* API integrations
* AI models
* Webhooks / triggers

---

If something breaks, it’s almost always a missing registry entry. This system is basically “plug everything in or nothing works” — no in-between 😄
