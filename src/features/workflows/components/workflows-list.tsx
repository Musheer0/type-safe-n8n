"use client"
import React, { useState, useMemo, useCallback, useRef } from 'react'
import { useWorkflows } from '@/features/workflows/hooks/use-workflows'
import { formatDistanceToNow } from 'date-fns'
import {
  Search, Workflow, Globe, Lock,
  Loader2, AlertCircle, ChevronDown, X, LayoutGrid, List, RefreshCw
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Toggle } from '@/components/ui/toggle'

// ── types ────────────────────────────────────────────────────────────────────
type WorkflowItem = {
  id: string
  name: string
  description?: string | null
  is_public: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

// ── skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-3 w-28" />
    </CardFooter>
  </Card>
)

const SkeletonRow = () => (
  <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-3 w-64" />
    </div>
    <Skeleton className="h-5 w-14 rounded-full" />
    <Skeleton className="h-3 w-24 hidden sm:block" />
  </div>
)

// ── workflow card (grid) ──────────────────────────────────────────────────────
const WorkflowCard = ({ workflow, index }: { workflow: WorkflowItem; index: number }) => (
  <Card
    className="group flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer"
    style={{ animationDelay: `${index * 35}ms` }}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Workflow className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-sm">{workflow.name}</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>

        <Badge
          variant={workflow.is_public ? 'default' : 'secondary'}
          className={`shrink-0 gap-1 text-xs ${
            workflow.is_public
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
              : ''
          }`}
        >
          {workflow.is_public
            ? <><Globe className="h-3 w-3" />Public</>
            : <><Lock className="h-3 w-3" />Private</>
          }
        </Badge>
      </div>
    </CardHeader>

    {workflow.description && (
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {workflow.description}
        </p>
      </CardContent>
    )}

    <CardFooter className="mt-auto pt-3 border-t">
      <p className="text-xs text-muted-foreground">
        Created {formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}
      </p>
    </CardFooter>
  </Card>
)

// ── workflow row (list) ───────────────────────────────────────────────────────
const WorkflowRow = ({ workflow }: { workflow: WorkflowItem }) => (
  <div className="group flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-all duration-150 hover:border-primary/40 hover:bg-accent/30 cursor-pointer">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
      <Workflow className="h-3.5 w-3.5" />
    </div>

    <div className="flex flex-1 flex-col min-w-0">
      <p className="truncate text-sm font-semibold text-foreground">{workflow.name}</p>
      {workflow.description && (
        <p className="truncate text-xs text-muted-foreground">{workflow.description}</p>
      )}
    </div>

    <Badge
      variant={workflow.is_public ? 'default' : 'secondary'}
      className={`shrink-0 gap-1 text-xs ${
        workflow.is_public
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
          : ''
      }`}
    >
      {workflow.is_public
        ? <><Globe className="h-3 w-3" />Public</>
        : <><Lock className="h-3 w-3" />Private</>
      }
    </Badge>

    <p className="shrink-0 text-xs text-muted-foreground hidden sm:block">
      {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
    </p>
  </div>
)

// ── main component ────────────────────────────────────────────────────────────
const WorkflowsList = () => {
  const {
    workflows,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useWorkflows()

  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return workflows
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q)
    )
  }, [workflows, search])

  const clearSearch = useCallback(() => {
    setSearch('')
    searchRef.current?.focus()
  }, [])

  // ── loading ──
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  // ── error ──
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load workflows</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-1">
            <span>{error.message}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5 p-6">

        {/* ── toolbar ── */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows…"
              className="pl-9 pr-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* view toggle */}
          <div className="flex items-center rounded-lg border bg-background p-1 gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={view === 'grid'}
                  onPressedChange={() => setView('grid')}
                  className="h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Grid view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={view === 'list'}
                  onPressedChange={() => setView('list')}
                  className="h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ── result count ── */}
        {search && (
          <p className="text-xs text-muted-foreground -mt-2">
            {filtered.length === 0
              ? 'No workflows match your search'
              : `${filtered.length} workflow${filtered.length !== 1 ? 's' : ''} found`
            }
          </p>
        )}

        {/* ── empty: no workflows ── */}
        {workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Workflow className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium">No workflows yet</p>
            <p className="text-xs text-muted-foreground">Create your first workflow to get started.</p>
          </div>
        )}

        {/* ── empty: no search results ── */}
        {workflows.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Search className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No results for "{search}"</p>
            <Button variant="link" size="sm" onClick={clearSearch} className="text-xs h-auto p-0">
              Clear search
            </Button>
          </div>
        )}

        {/* ── grid view ── */}
        {view === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((workflow, i) => (
              <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
            ))}
          </div>
        )}

        {/* ── list view ── */}
        {view === 'list' && filtered.length > 0 && (
          <div className="flex flex-col gap-2">
            {filtered.map((workflow) => (
              <WorkflowRow key={workflow.id} workflow={workflow} />
            ))}
          </div>
        )}

        {/* ── load more ── */}
        {hasNextPage && !search && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="gap-2"
            >
              {isFetchingNextPage
                ? <><Loader2 className="h-4 w-4 animate-spin" />Loading…</>
                : <><ChevronDown className="h-4 w-4" />Load more</>
              }
            </Button>
          </div>
        )}

        {/* ── all loaded ── */}
        {!hasNextPage && workflows.length > 0 && !search && (
          <>
            <Separator />
            <p className="text-center text-xs text-muted-foreground">
              All {workflows.length} workflows loaded
            </p>
          </>
        )}

      </div>
    </TooltipProvider>
  )
}

export default WorkflowsList