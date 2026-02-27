"use client";

import { orpc } from "@repo/api/client";
import { useQuery } from "@tanstack/react-query";
import { TodoItem } from "@/features/todos/components/TodoItem";

export function TodoList() {
  const { data: todos = [], isLoading: isFetching } = useQuery(orpc.todos.getTodos.queryOptions());

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-pulse text-muted-foreground">Loading todos...</div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
