"use client";

import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/web/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminTodosPage() {
  const queryClient = useQueryClient();
  const { data: todos, isLoading } = useQuery(orpc.admin.getTodos.queryOptions());

  const updateTodoMutation = useMutation(
    orpc.admin.updateTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.admin.getTodos.key() });
      },
      onError: (err) => {
        toast.error(err.message || "An error occurred");
      },
    }),
  );

  const deleteTodoMutation = useMutation(
    orpc.admin.deleteTodo.mutationOptions({
      onSuccess: () => {
        toast.success("Todo item deleted");
        queryClient.invalidateQueries({ queryKey: orpc.admin.getTodos.key() });
      },
      onError: (err) => {
        toast.error(err.message || "An error occurred");
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Todo Models
          </h2>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {todos?.length || 0} Total Items
          </span>
        </div>
        <Link href="/admin/todos/create">
          <Button>Create Todo</Button>
        </Link>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User ID (Owner)</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos?.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Button
                    onClick={() =>
                      updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed })
                    }
                    disabled={updateTodoMutation.isPending}
                    className="disabled:opacity-50"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-700" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">
                  {todo.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{todo.userId}</TableCell>
                <TableCell className="font-medium max-w-xs truncate" title={todo.title}>
                  {todo.title}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap space-x-2">
                  <Link href={`/admin/todos/${todo.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Edit className="w-4 h-4 text-zinc-500" />
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                    onClick={() => {
                      if (confirm("Delete this internal record?")) {
                        deleteTodoMutation.mutate({ id: todo.id });
                      }
                    }}
                    disabled={deleteTodoMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!todos || todos.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No todos currently stored in the system.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
