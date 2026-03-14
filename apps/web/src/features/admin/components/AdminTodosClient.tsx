"use client";

import type { TodoWithUser } from "@repo/db/types";
import { TODO_STATUSES, type TodoStatus } from "@repo/types";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/web/components/ui/avatar";
import { Badge } from "@repo/ui/web/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { DataTable } from "@repo/ui/web/components/ui/data-table";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useAdminTodos } from "@/lib/hooks/use-admin-todos";

export const AdminTodosClient = () => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: false }),
  );
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(TODO_STATUSES).withDefault("all").withOptions({
      shallow: false,
    }),
  );
  const [view, setView] = useQueryState("view", { defaultValue: "table", shallow: false });

  const { data: response, isLoading } = useAdminTodos(
    page,
    limit,
    search,
    status === "all" ? undefined : status,
  );

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

  const columns: ColumnDef<TodoWithUser>[] = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const todo = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={todo.user.image ?? undefined} alt={todo.user.name} />
                <AvatarFallback>{todo.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{todo.user.name}</span>
                <span className="text-xs text-muted-foreground">{todo.user.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: "Task",
        cell: ({ row }) => (
          <div className="font-medium max-w-[300px] truncate">{row.original.title}</div>
        ),
      },
      {
        accessorKey: "completed",
        header: "Status",
        cell: ({ row }) => {
          const completed = row.original.completed;
          return completed ? (
            <Badge
              variant="default"
              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
            >
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">System Todos</h1>
        <p className="text-muted-foreground">Manage and monitor all todos across the platform.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All User Tasks</CardTitle>
          <CardDescription>A complete list of todos from every user in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={(response?.data as TodoWithUser[]) || []}
              pageCount={response?.metadata?.totalPages || 0}
              pagination={pagination}
              onPaginationChange={onPaginationChange}
              searchKey="todos"
              searchValue={search}
              onSearchChange={setSearch}
              viewMode={view as "table" | "grid"}
              onViewModeChange={(v) => setView(v)}
              renderCard={(todo) => (
                <Card
                  key={todo.id}
                  className="overflow-hidden transition-all hover:shadow-md border-border/50"
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 text-xs">
                    <Badge
                      variant={todo.completed ? "default" : "secondary"}
                      className={
                        todo.completed
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </Badge>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] mb-3">
                      {todo.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={todo.user.image ?? undefined} alt={todo.user.name} />
                        <AvatarFallback className="text-[10px]">
                          {todo.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium truncate">{todo.user.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              filterConfigs={[
                {
                  name: "status",
                  value: status,
                  onValueChange: (v) => setStatus(v as TodoStatus),
                  options: [
                    { label: "Completed", value: "completed" },
                    { label: "Pending", value: "pending" },
                  ],
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
