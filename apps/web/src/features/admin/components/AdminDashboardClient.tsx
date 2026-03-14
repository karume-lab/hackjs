"use client";

import { authClient } from "@repo/auth/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ListTodo,
  Loader2,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";

export const AdminDashboardClient = () => {
  // Fetch users for statistics
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin-users-stats"],
    queryFn: async () => {
      const response = await authClient.admin.listUsers({
        query: { limit: 1000 },
      });
      if (response.error) throw new Error(response.error.message || "Failed to fetch users");
      return response.data;
    },
  });

  // Fetch todos for statistics
  const { data: todosData, isLoading: isTodosLoading } = useQuery({
    queryKey: ["admin-todos-stats"],
    queryFn: async () => {
      const { data, error } = await api.admin.todos.get({
        query: { limit: 1000 },
      });
      if (error) throw error;
      return data.data;
    },
  });

  const isLoading = isUsersLoading || isTodosLoading;

  const users = usersData?.users || [];
  const todos = todosData || [];

  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const activeUsers = totalUsers - bannedUsers;

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const avgTodosPerUser = totalUsers > 0 ? (totalTodos / totalUsers).toFixed(1) : "0";

  // New Engagement Metric: Users who have at least one todo
  const usersWithTasks = new Set(todos.map((t) => t.userId)).size;
  const activationRate = totalUsers > 0 ? Math.round((usersWithTasks / totalUsers) * 100) : 0;

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
        <p className="text-muted-foreground">
          Real-time statistics and performance metrics for the HackJS application.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts across platform
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Non-banned platform users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Accounts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : bannedUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently restricted access</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Activation</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : `${activationRate}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Members with at least one task</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              Task Statistics
            </CardTitle>
            <CardDescription>Aggregate metrics for user-created todos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="text-3xl font-bold">{isLoading ? "..." : totalTodos}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-3xl font-bold text-emerald-500">
                  {isLoading ? "..." : completedTodos}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-3xl font-bold text-amber-500">
                  {isLoading ? "..." : pendingTodos}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Task Completion Progress</span>
                  <span className="text-muted-foreground">{completionRate}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              User Engagement
            </CardTitle>
            <CardDescription>How users interact with tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Avg Tasks per User</span>
                <span className="text-2xl font-bold">{isLoading ? "..." : avgTodosPerUser}</span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground italic text-xs">
                  These metrics are refreshed in real-time.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
