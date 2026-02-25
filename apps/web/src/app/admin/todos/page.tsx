"use client";

import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { DataTable } from "@repo/ui/web/components/ui/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { CheckCircle2, Circle, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type SystemTodo = {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

export default function AdminTodosPage() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: response, isLoading } = useQuery(
    orpc.admin.getTodos.queryOptions({
      input: { page: pagination.pageIndex + 1, limit: pagination.pageSize },
    }),
  );

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

  const columns: ColumnDef<SystemTodo>[] = useMemo(
    () => [
      {
        accessorKey: "completed",
        header: "Status",
        cell: ({ row }) => {
          const todo = row.original;
          return (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed })}
              disabled={updateTodoMutation.isPending}
              className="disabled:opacity-50 h-8 w-8"
            >
              {todo.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-700" />
              )}
            </Button>
          );
        },
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-zinc-500">{row.original.id.slice(0, 8)}...</span>
        ),
      },
      {
        accessorKey: "userId",
        header: "User ID (Owner)",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-zinc-500">{row.original.userId}</span>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-medium max-w-[200px] block truncate" title={row.original.title}>
            {row.original.title}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const todo = row.original;
          return (
            <div className="text-right whitespace-nowrap space-x-2">
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
            </div>
          );
        },
      },
    ],
    [updateTodoMutation, deleteTodoMutation],
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
            {response?.metadata?.totalCount || 0} Total Items
          </span>
        </div>
        <Link href="/admin/todos/create">
          <Button>Create Todo</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={(response?.data as SystemTodo[]) || []}
        pageCount={response?.metadata?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
