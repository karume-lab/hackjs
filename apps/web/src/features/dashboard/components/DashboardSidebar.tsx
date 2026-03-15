"use client";

import { authClient } from "@repo/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@repo/ui/web/components/ui/sidebar";
import { ListTodo, User } from "lucide-react";
import { NavMain, NavUser } from "@/components/shared/SidebarComponents";
import SiteLogo from "@/components/shared/SiteLogo";

const navMain = [
  {
    title: "Tasks",
    url: "/dashboard",
    icon: ListTodo,
    isActive: true,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session, isPending } = authClient.useSession();
  const { state } = useSidebar();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image ?? "",
      }
    : null;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 transition-all duration-200 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center h-12">
          <SiteLogo
            className={`w-auto object-contain shrink-0 transition-all duration-200 ${isCollapsed ? "h-8" : "h-10"}`}
          />
          <span className="font-bold text-xl group-data-[collapsible=icon]:hidden whitespace-nowrap">
            HackJS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 animate-pulse rounded bg-sidebar-accent" />
              <div className="h-2 w-24 animate-pulse rounded bg-sidebar-accent" />
            </div>
          </div>
        ) : (
          user && <NavUser user={user} showReturnToTasks />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
