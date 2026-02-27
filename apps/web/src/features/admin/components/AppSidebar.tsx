"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/web/components/ui/sidebar";
import { CheckSquare, LayoutDashboard, type LucideIcon, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

type NavItem<T extends string = string> = {
  title: string;
  href: Route<T>;
  icon: LucideIcon;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Core Assets",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },
  {
    label: "Database Models",
    items: [
      {
        title: "Todos",
        href: "/admin/todos",
        icon: CheckSquare,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin">
          <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground uppercase text-center">
            Site Admin
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-sidebar-foreground">Theme</span>
          <ThemeSwitch />
        </div>
        <SignOutButton
          variant="outline"
          className="w-full flex items-center justify-center border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/30 dark:hover:bg-destructive/20"
          showIcon={true}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
