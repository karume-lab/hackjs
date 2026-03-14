"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/web/components/ui/avatar";
import { Badge } from "@repo/ui/web/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/web/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export function AdminTodosClient() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ["admin-todos"],
    queryFn: async () => {
      const { data, error } = await api.admin.todos.get();
      if (error) throw error;
      return data.data;
    },
  });

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todos?.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {todo.title}
                    </TableCell>
                    <TableCell>
                      {todo.completed ? (
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
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {todos?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No todos found in the system.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
