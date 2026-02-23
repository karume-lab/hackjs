"use client";

import { orpc } from "@repo/api/client";
import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import { Input } from "@repo/ui/web/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    authClient.getSession().then(({ data: session }) => {
      if (!session) {
        router.push("/login");
      }
    });
  }, [router]);

  // oRPC TanStack Query hooks integration using standard useQuery/useMutation
  const { data: todos = [], isLoading: isFetching } = useQuery(orpc.todos.getTodos.queryOptions());

  const { mutate: createTodo } = useMutation(
    orpc.todos.createTodo.mutationOptions({
      onSuccess: () => {
        setNewTodo("");
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
        toast.success("Todo added!");
      },
      onError: (e) => {
        console.error("Failed to add todo", e);
        toast.error("Failed to add todo.");
      },
    }),
  );

  const { mutate: toggleTodo } = useMutation(
    orpc.todos.updateTodo.mutationOptions({
      onSuccess: (_, variables: { id?: string; completed?: boolean }) => {
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
        toast.success(variables.completed ? "Todo completed!" : "Todo marked as pending");
      },
      onError: (e) => {
        console.error("Failed to toggle todo", e);
        toast.error("Failed to update todo.");
      },
    }),
  );

  const { mutate: deleteTodo } = useMutation(
    orpc.todos.deleteTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
        toast.success("Todo deleted");
      },
      onError: (e) => {
        console.error("Failed to delete todo", e);
        toast.error("Failed to delete todo.");
      },
    }),
  );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    createTodo({ title: newTodo, completed: false });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ease Dashboard
          </h1>
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </nav>

      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button type="submit" className="px-6">
                Add
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              {todos.length === 0 ? (
                <p className="text-center text-zinc-500 dark:text-zinc-400 py-6">
                  No todos yet. Add one above!
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-zinc-100 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 ${todo.completed ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTodo({ id: todo.id, completed: !todo.completed })}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${todo.completed ? "border-blue-600 bg-blue-600" : "border-zinc-300 dark:border-zinc-600"}`}
                      >
                        {todo.completed && (
                          <svg
                            className="h-3.5 w-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <title>Completed</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`text-zinc-800 dark:text-zinc-200 ${todo.completed ? "line-through text-zinc-500" : ""}`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTodo({ id: todo.id })}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition px-2 py-1"
                      aria-label="Delete todo"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <title>Delete</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
