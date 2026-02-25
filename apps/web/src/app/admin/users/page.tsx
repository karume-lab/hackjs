"use client";

import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { DataTable } from "@repo/ui/web/components/ui/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Edit, Loader2, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Assuming User type inference from the API, we can use a generic record type or infer it
type SystemUser = { id: string; name: string; email: string; role: string | null; createdAt: Date };

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: response, isLoading } = useQuery(
    orpc.admin.getUsers.queryOptions({
      input: { page: pagination.pageIndex + 1, limit: pagination.pageSize },
    }),
  );

  const updateRoleMutation = useMutation(
    orpc.admin.updateUserRole.mutationOptions({
      onSuccess: () => {
        toast.success("User role updated");
        queryClient.invalidateQueries({ queryKey: orpc.admin.getUsers.key() });
      },
      onError: (err: unknown) => {
        const error = err as Error;
        toast.error(error.message || "An error occurred");
      },
    }),
  );

  const deleteUserMutation = useMutation(
    orpc.admin.deleteUser.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: orpc.admin.getUsers.key() });
      },
      onError: (err: unknown) => {
        const error = err as Error;
        toast.error(error.message || "An error occurred");
      },
    }),
  );

  const columns: ColumnDef<SystemUser>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-zinc-500">{row.original.id.slice(0, 8)}...</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <span
              className={
                role === "admin"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 px-2 py-1 rounded-full text-xs font-semibold"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1 rounded-full text-xs font-medium"
              }
            >
              {role || "user"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="text-right space-x-2 whitespace-nowrap">
              <Link href={`/admin/users/${user.id}`}>
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
                variant="outline"
                size="sm"
                onClick={() =>
                  updateRoleMutation.mutate({
                    id: user.id,
                    role: user.role === "admin" ? "user" : "admin",
                  })
                }
                disabled={updateRoleMutation.isPending}
              >
                {user.role === "admin" ? (
                  <>
                    <User className="w-4 h-4 mr-2" /> Demote
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" /> Promote
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to completely delete this user?")) {
                    deleteUserMutation.mutate({ id: user.id });
                  }
                }}
                disabled={deleteUserMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [updateRoleMutation, deleteUserMutation],
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
            User Management
          </h2>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {response?.metadata?.totalCount || 0} Total Records
          </span>
        </div>
        <Link href="/admin/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={(response?.data as SystemUser[]) || []}
        pageCount={response?.metadata?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
