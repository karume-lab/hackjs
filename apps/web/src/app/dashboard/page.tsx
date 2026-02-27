"use client";

import { orpc } from "@repo/api/client";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { TodoForm } from "@/features/todos/components/TodoForm";
import { TodoList } from "@/features/todos/components/TodoList";

export default function DashboardPage() {
  const { isLoading: isFetching } = useQuery(orpc.todos.getTodos.queryOptions());

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">
            Taskly Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            <TodoForm />
            <TodoList />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
