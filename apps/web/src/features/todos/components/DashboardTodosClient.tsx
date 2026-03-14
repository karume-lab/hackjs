"use client";

import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import { Input } from "@repo/ui/web/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ListTodo, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { api } from "@/lib/api";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string | Date;
}

export function DashboardTodosClient() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await api.todos.get();
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await api.todos.post({ title });
      if (error) throw error;
      return data;
    },
    onSuccess: (created) => {
      if (created) {
        queryClient.setQueryData(["todos"], (old: Todo[] | undefined) =>
          old ? [created, ...old] : [created],
        );
        setNewTodo("");
        toast.success("Todo added!");
      }
    },
    onError: () => {
      toast.error("Failed to add todo");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await api.todos({ id }).patch({ completed: !completed });
      if (error) throw error;
      return { id, completed: !completed };
    },
    onSuccess: ({ id, completed }) => {
      queryClient.setQueryData(["todos"], (old: Todo[] | undefined) =>
        old?.map((t) => (t.id === id ? { ...t, completed } : t)),
      );
    },
    onError: () => {
      toast.error("Failed to update todo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.todos({ id }).delete();
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (old: Todo[] | undefined) =>
        old?.filter((t) => t.id !== id),
      );
      toast.success("Todo deleted");
    },
    onError: () => {
      toast.error("Failed to delete todo");
    },
  });

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addMutation.mutate(newTodo);
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-card-foreground">Momentum</h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-12 max-w-2xl px-4 sm:px-6 lg:px-8 pb-20">
        <header className="mb-8 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tasks
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Manage your daily goals and stay productive.
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">
              {todos?.filter((t) => !t.completed).length} pending
            </span>
          </p>
        </header>

        <form onSubmit={addTodo} className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <Card className="relative border-border/50 bg-card/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50 h-12"
              />
              <Button
                disabled={addMutation.isPending || !newTodo.trim()}
                type="submit"
                size="icon"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shrink-0 w-10 h-10 shadow-lg shadow-indigo-500/20"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-muted-foreground animate-pulse text-sm font-medium">
                Loading your momentum...
              </p>
            </div>
          ) : todos?.length === 0 ? (
            <Card className="border-dashed border-border/50 bg-card/20 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-semibold text-foreground/70">All caught up!</h3>
              <p className="text-muted-foreground text-sm max-w-[200px]">
                You have no tasks for now. Enjoy your free time!
              </p>
            </Card>
          ) : (
            <AnimatePresence initial={false}>
              {todos?.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Card
                    className={`group border-border/40 hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md ${todo.completed ? "bg-muted/30" : "bg-card"}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          toggleMutation.mutate({ id: todo.id, completed: todo.completed })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          toggleMutation.mutate({ id: todo.id, completed: todo.completed })
                        }
                        className="cursor-pointer transition-transform active:scale-95 shrink-0"
                      >
                        {todo.completed ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
                        )}
                      </button>

                      <span
                        className={`flex-1 text-sm md:text-base font-medium transition-all duration-300 ${todo.completed ? "text-muted-foreground line-through decoration-indigo-500/40" : "text-foreground"}`}
                      >
                        {todo.title}
                      </span>

                      <Button
                        onClick={() => deleteMutation.mutate(todo.id)}
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
