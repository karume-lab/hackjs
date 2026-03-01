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
import { signUpSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (error) throw new Error(error.message || "Failed to create account");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Account created successfully!");
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      router.push(callbackUrl as Route);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUpMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
          Join HackJS to start managing your tasks today.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {signUpMutation.isError && (
          <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {signUpMutation.error.message}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
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
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
            {signUpMutation.isPending ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-zinc-100 p-6 dark:border-zinc-800/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
