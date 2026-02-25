"use client";

import { CheckSquare, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Django Style Navigation */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
        <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
          <Link href="/admin">
            <h1 className="mb-8 text-2xl font-bold tracking-tight text-sidebar-foreground px-2 uppercase text-center border-b pb-4 border-sidebar-border">
              Site Admin
            </h1>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Core Assets
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin/users"
                    className={`flex flex-row items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin/users")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 dark:text-sidebar-foreground dark:hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Database Models
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin/todos"
                    className={`flex flex-row items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin/todos")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 dark:text-sidebar-foreground dark:hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Todos
                  </Link>
                </li>
              </ul>
            </div>

            <div className="absolute bottom-6 left-0 right-0 px-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sidebar-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <SignOutButton
                variant="outline"
                className="w-full flex items-center justify-center border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/30 dark:hover:bg-destructive/20"
                showIcon={true}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 ml-64 p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
