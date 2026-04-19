import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useTRPC } from "@/trpc/client";

export const useWorkflows = () => {
  const trpc = useTRPC();

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
        retry: false,
      },
    ),
  );

  // Flatten all pages into a single workflows array
  const workflows = useMemo(
    () => data?.pages.flatMap((page) => page.workflows) ?? [],
    [data],
  );

  return {
    workflows,
    isLoading, // true only on first load (no data yet)
    isFetching, // true on any background refetch
    isFetchingNextPage, // true when loading the next page
    hasNextPage, // whether there are more pages to fetch
    fetchNextPage, // call this to load the next page
    error,
    refetch,
  };
};
export const useWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.workflows.getById.queryOptions({ id }));
};

export const useCachedWorkflow = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const queryKey = trpc.workflows.getById.queryKey({ id });
  const data = queryClient.getQueryData(queryKey);

  if (!data) return null;
  return data as Awaited<
    ReturnType<ReturnType<typeof trpc.workflows.getById.queryFn>>
  >;
};
