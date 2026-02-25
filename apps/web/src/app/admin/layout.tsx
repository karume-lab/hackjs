"use client";

import { CheckSquare, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar - Django Style Navigation */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
          <Link href="/admin">
            <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 px-2 uppercase text-center border-b pb-4 dark:border-zinc-800">
              Site Admin
            </h1>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Core Assets
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin/users"
                    className={`flex flex-row items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin/users")
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Database Models
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin/todos"
                    className={`flex flex-row items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin/todos")
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Todos
                  </Link>
                </li>
              </ul>
            </div>

            <div className="absolute bottom-6 left-0 right-0 px-4 space-y-2">
              <SignOutButton
                variant="outline"
                className="w-full flex items-center justify-center border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/50"
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
