"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { signInSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (values: SignInFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) throw new Error(error.message || "Invalid credentials");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Welcome back!");
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      router.push(callbackUrl as Route);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    signInMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to Ease
          </CardTitle>
          <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 2. Use built-in error state from TanStack Query */}
          {signInMutation.isError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {signInMutation.error.message}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
              {signInMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zinc-100 p-6 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
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
