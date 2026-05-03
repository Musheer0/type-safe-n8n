"use client"
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SearchIcon, X } from 'lucide-react'
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { nodeUIRegistry } from '../libs/node-registry'
import { baseInitialData } from '../types/node-data-inputs'
import {applyNodeChanges} from '@xyflow/react'
import { NodeType } from '@/generated/prisma/enums'
import { useEditor } from '../stores/node-store'
type NodeKey = keyof typeof nodeUIRegistry

interface NodeSelectorProps {
  children: React.ReactNode
  onNodeSelect?: (nodeType: NodeKey) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  trigger: 'Triggers',
  executor: 'Actions',
}

const CATEGORY_ORDER = ['trigger', 'executor']

const handleClick = (type:NodeType,)=>{
    const nodeMetadata = nodeUIRegistry[type]
    if(!nodeMetadata) return
    alert(type)


}

const NodeSelector = ({ children, onNodeSelect }: NodeSelectorProps) => {
  const [query, setQuery] = useState('')
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const {addNode,nodes} = useEditor()
  useEffect(() => {
    if (open) {
      setQuery('')
      setFocusedIdx(-1)
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [open])

  const allNodes = useMemo(() =>
    Object.entries(nodeUIRegistry).map(([key, info]) => ({
      key: key as NodeKey,
      ...info,
    })),
    []
  )
 
  const filtered = useMemo(() => {
    if (!query.trim()) return allNodes
    const q = query.toLowerCase()
    return allNodes.filter(n =>
      n.name.toLowerCase().includes(q) ||
      (n.description||"").toLowerCase().includes(q)
    )
  }, [query, allNodes])

  // Group by `type` from the registry, respecting CATEGORY_ORDER
  const grouped = useMemo(() => {
    const map: Partial<Record<string, typeof filtered>> = {}
    filtered.forEach(n => {
      const cat = n.type ?? 'executor'
      if (!map[cat]) map[cat] = []
      map[cat]!.push(n)
    })
    // Return sorted by CATEGORY_ORDER
    return CATEGORY_ORDER
      .filter(cat => map[cat]?.length)
      .map(cat => ({ type: cat, nodes: map[cat]! }))
  }, [filtered])

  const flatFiltered = useMemo(() =>
    grouped.flatMap(g => g.nodes),
    [grouped]
  )

  const handleSelect =(key:NodeType)=>{
    addNode(key)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(i => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      handleSelect(flatFiltered[focusedIdx].key)
    } else if (e.key === 'Escape') {
      if (query) {
        setQuery('')
        setFocusedIdx(-1)
      } else {
        setOpen(false)
      }
    }
  }

  let globalIdx = 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 w-[340px]">

        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-0 space-y-0.5">
          <SheetTitle className="text-base font-semibold">Nodes</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Add nodes to your workflow
          </SheetDescription>

          {/* Search */}
          <div className="relative mt-3 mb-3">
            <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setFocusedIdx(-1) }}
              onKeyDown={handleKeyDown}
              placeholder="Search nodes..."
              className="pl-8 h-8 text-sm bg-muted/40"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setFocusedIdx(-1); searchRef.current?.focus() }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="border-t" />

        {/* Node list */}
        <div className="flex-1 overflow-y-auto">
          {flatFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <SearchIcon className="w-8 h-8 opacity-20" />
              <p className="text-sm">No nodes match &quot;{query}&quot;</p>
            </div>
          ) : (
            grouped.map(({ type, nodes }) => (
              <div key={type}>
                {/* Category header */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {CATEGORY_LABELS[type] ?? type}
                  </span>
                  <span className="text-[10px] text-muted-foreground/40">
                    {nodes.length}
                  </span>
                </div>

                {nodes.map(node => {
                  const idx = globalIdx++
                  const isFocused = idx === focusedIdx

                  return (
                    <button
                      key={node.key}
                      data-node-type={node.key}
                      onClick={() => handleSelect(node.key)}
                      onMouseEnter={() => setFocusedIdx(idx)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5
                        border-b last:border-b-0 text-left
                        transition-colors duration-100 group
                        ${isFocused ? 'bg-accent' : 'hover:bg-muted/40'}
                      `}
                    >
                      {/* Icon */}
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border bg-background">
                        {typeof node.logo === 'string' ? (
                          <img src={node.logo} width={18} height={18} alt={node.name} />
                        ) : (
                          <node.logo size={18} className="text-foreground" />
                        )}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-none truncate">
                          {node.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {node.description}
                        </p>
                      </div>

                      {/* Type badge */}
                      <span className={`
                        flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full
                        ${node.type === 'trigger'
                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                          : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                        }
                      `}>
                        {node.type}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex gap-3 text-[10px] text-muted-foreground/40">
          <span><kbd className="font-mono bg-muted px-1 rounded text-[9px]">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-muted px-1 rounded text-[9px]">↵</kbd> select</span>
          <span><kbd className="font-mono bg-muted px-1 rounded text-[9px]">Esc</kbd> close</span>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NodeSelector