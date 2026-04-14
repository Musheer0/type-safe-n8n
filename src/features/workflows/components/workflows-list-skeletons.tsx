"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
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
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-3 w-64" />
    </div>
    <Skeleton className="h-5 w-14 rounded-full" />
    <Skeleton className="h-3 w-24 hidden sm:block" />
  </div>
);
