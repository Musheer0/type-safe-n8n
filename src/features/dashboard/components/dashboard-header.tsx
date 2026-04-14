"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workflow, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { path: "/workflows", label: "Workflows", icon: Workflow },
  { path: "/your-templates", label: "Templates", icon: LayoutTemplate },
];

const DashboardHeader = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-1 border-b px-4 bg-background">
      {routes.map(({ path, label, icon: Icon }) => {
        const isActive = pathname === path || pathname.startsWith(path + "/");
        return (
          <Link
            key={path}
            href={path}
            className={cn(
              "relative flex items-center gap-2 h-12 px-4 text-sm transition-colors",
              "text-muted-foreground hover:text-foreground",
              isActive && "text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardHeader;