"use client";

import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { Input } from "@repo/ui/web/components/ui/input";
import { Label } from "@repo/ui/web/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Define the Mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) throw new Error(error.message || "Invalid credentials");
      return data;
    },
    onSuccess: () => {
      // Invalidate session queries so the Navbar/Dashboard updates immediately
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Log in to Ease
          </CardTitle>
          <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 2. Use built-in error state from TanStack Query */}
          {loginMutation.isError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {loginMutation.error.message}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* 3. Use isPending for the loading state */}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zinc-100 p-6 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
