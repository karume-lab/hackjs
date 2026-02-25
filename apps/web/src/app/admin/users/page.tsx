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
import { Edit, Loader2, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery(orpc.admin.getUsers.queryOptions());

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
            {users?.length || 0} Total Records
          </span>
        </div>
        <Link href="/admin/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs text-zinc-500">
                  {user.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <span
                    className={
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 px-2 py-1 rounded-full text-xs font-semibold"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1 rounded-full text-xs font-medium"
                    }
                  >
                    {user.role || "user"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
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
                </TableCell>
              </TableRow>
            ))}
            {(!users || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No users found in the database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
