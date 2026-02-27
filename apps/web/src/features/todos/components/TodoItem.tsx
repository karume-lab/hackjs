"use client";

import { orpc } from "@repo/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

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

  return (
    <div
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
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  );
}
