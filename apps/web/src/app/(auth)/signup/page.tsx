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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (error) throw new Error(error.message || "Failed to create account");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Join Ease to start managing your tasks today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {signupMutation.isError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {signupMutation.error.message}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zinc-100 p-6 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
