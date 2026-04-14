import { useTRPC } from '@/trpc/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useWorkflows = () => {
  const trpc = useTRPC()

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery(
    trpc.workflows.getAll.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
        retry:false
      }
    )
  )

  // Flatten all pages into a single workflows array
  const workflows = useMemo(
    () => data?.pages.flatMap((page) => page.workflows) ?? [],
    [data]
  )

  return {
    workflows,
    isLoading,                // true only on first load (no data yet)
    isFetching,               // true on any background refetch
    isFetchingNextPage,       // true when loading the next page
    hasNextPage,              // whether there are more pages to fetch
    fetchNextPage,            // call this to load the next page
    error,
    refetch,
  }
}