"use client";

import type { User as SystemUser } from "@repo/db/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/web/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/web/components/ui/avatar";
import { Badge } from "@repo/ui/web/components/ui/badge";
import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/web/components/ui/card";
import { DataTable } from "@repo/ui/web/components/ui/data-table";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { Edit, Loader2, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useAdminUsers, useDeleteUser, useUpdateUserRole } from "@/lib/hooks/use-admin-users";

export const AdminUsersClient = () => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: false }),
  );
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [view, setView] = useQueryState("view", { defaultValue: "table", shallow: false });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: response, isLoading } = useAdminUsers(page, limit, search);

  const updateRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const pagination = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const nextPagination =
      typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;

    setPage(nextPagination.pageIndex + 1);
    setLimit(nextPagination.pageSize);
  };

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
                loading={
                  updateRoleMutation.isPending && updateRoleMutation.variables?.id === user.id
                }
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
                onClick={() => setDeleteConfirmId(user.id)}
                loading={
                  deleteUserMutation.isPending && deleteUserMutation.variables?.id === user.id
                }
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
        onPaginationChange={onPaginationChange}
        searchKey="users"
        searchValue={search}
        onSearchChange={setSearch}
        viewMode={view as "table" | "grid"}
        onViewModeChange={(v) => setView(v)}
        renderCard={(user) => (
          <Card
            key={user.id}
            className="overflow-hidden transition-all hover:shadow-md border-border/50"
          >
            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className={
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                    : ""
                }
              >
                {user.role || "user"}
              </Badge>
              <div className="flex gap-1">
                <Link href={`/admin/users/${user.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4 text-zinc-500" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteConfirmId(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Avatar className="h-16 w-16 mb-3 border-2 border-background shadow-sm">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-base truncate w-full">{user.name}</h3>
              <p className="text-xs text-muted-foreground truncate w-full">{user.email}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() =>
                  updateRoleMutation.mutate({
                    id: user.id,
                    role: user.role === "admin" ? "user" : "admin",
                  })
                }
                loading={
                  updateRoleMutation.isPending && updateRoleMutation.variables?.id === user.id
                }
              >
                {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
              </Button>
            </CardFooter>
          </Card>
        )}
      />

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove
              their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteConfirmId) {
                  deleteUserMutation.mutate({ id: deleteConfirmId });
                  setDeleteConfirmId(null);
                }
              }}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
