"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import { Input } from "@repo/ui/web/components/ui/input";
import { insertTodoSchema } from "@repo/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeSwitch } from "@/components/ThemeSwitch";

type TodoFormValues = z.infer<typeof insertTodoSchema>;

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const { data: todos = [], isLoading: isFetching } = useQuery(orpc.todos.getTodos.queryOptions());

  const { mutate: createTodo } = useMutation(
    orpc.todos.createTodo.mutationOptions({
      onSuccess: () => {
        reset();
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
      onSuccess: (_, variables) => {
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

  const onSubmit = (values: TodoFormValues) => {
    createTodo({ title: values.title, completed: false });
  };

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
            <form className="mb-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="What needs to be done?"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <Button type="submit">Add Task</Button>
              </div>
            </form>

            <div className="mt-8 space-y-3">
              {todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No todos yet. Add one above!
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4 transition hover:bg-muted ${todo.completed ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTodo({ id: todo.id, completed: !todo.completed })}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${todo.completed ? "border-primary bg-primary" : "border-border"}`}
                      >
                        {todo.completed && (
                          <svg
                            className="h-3.5 w-3.5 text-primary-foreground"
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
                        className={`text-foreground ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTodo({ id: todo.id })}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition px-2 py-1"
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
