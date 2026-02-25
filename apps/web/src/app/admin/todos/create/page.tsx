"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/web/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/web/components/ui/form";
import { Input } from "@repo/ui/web/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/web/components/ui/select";
import { adminCreateTodoSchema } from "@repo/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CreateTodoFormValues = z.infer<typeof adminCreateTodoSchema>;

export default function AdminTodoCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateTodoFormValues>({
    resolver: zodResolver(adminCreateTodoSchema),
    defaultValues: {
      title: "",
      completed: false,
      userId: "",
    },
  });

  const { data: usersResponse, isLoading: usersLoading } = useQuery(
    orpc.admin.getUsers.queryOptions({ input: { limit: 1000 } }),
  );
  const users = usersResponse?.data || [];

  const createTodoMutation = useMutation(
    orpc.admin.createTodo.mutationOptions({
      onSuccess: () => {
        toast.success("Todo successfully created and assigned");
        queryClient.invalidateQueries({ queryKey: orpc.admin.getTodos.key() });
        router.push("/admin/todos");
      },
      onError: (err: unknown) => {
        const error = err as Error;
        toast.error(error.message || "Failed to create todo record");
      },
    }),
  );

  const { isDirty } = form.formState;

  const onSubmit = (values: CreateTodoFormValues) => {
    createTodoMutation.mutate(values);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/admin/todos">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Provision New Task
          </h2>
          <p className="text-sm text-zinc-500">Create and assign a Todo to any system user</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="What needs to be done?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t dark:border-zinc-800">
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To User</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={usersLoading}
                        >
                          <FormControl>
                            <SelectTrigger id="userId" className="w-full bg-background">
                              <SelectValue placeholder="Select a user to assign..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/todos")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isDirty || createTodoMutation.isPending}>
                  {createTodoMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Provision Task
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
