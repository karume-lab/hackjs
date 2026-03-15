"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { authClient } from "@repo/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@repo/ui/web/components/ui/sidebar";
import { BookOpen, Code2, LayoutDashboard, Settings2 } from "lucide-react";
import { NavMain, NavProjects, NavUser } from "@/components/shared/SidebarComponents";
import SiteLogo from "@/components/shared/SiteLogo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Users",
          url: "/admin/users",
        },
        {
          title: "Todos",
          url: "/admin/todos",
        },
      ],
    },
    {
      title: "Developer",
      url: "#",
      icon: Code2,
      items: [
        {
          title: "API Reference",
          url: "/docs/api/reference",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Quick Start Tutorial",
      url: "https://code2tutorial.com/tutorial/926b939b-24c9-487a-a3f9-359877d46087/index.md",
      icon: BookOpen,
    },
    {
      name: "Documentation",
      url: "/docs/getting-started",
      icon: BookOpen,
    },
    {
      name: "GitHub",
      url: "https://github.com/karume-lab/HackJS",
      icon: SiGithub,
    },
  ],
};

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
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
          user && <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
