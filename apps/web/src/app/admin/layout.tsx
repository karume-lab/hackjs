"use client";

import { Separator } from "@repo/ui/web/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/web/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "@/features/admin/components/AppSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
        </header>
        <div className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
