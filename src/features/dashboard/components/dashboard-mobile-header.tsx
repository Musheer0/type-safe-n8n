"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workflow, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { path: "/workflows", label: "Workflows", icon: Workflow },
  { path: "/your-templates", label: "Templates", icon: LayoutTemplate },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background">
      {routes.map(({ path, label, icon: Icon }) => {
        const isActive = pathname === path || pathname.startsWith(path + "/");
        return (
          <Link
            key={path}
            href={path}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className={cn(isActive && "font-medium")}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;