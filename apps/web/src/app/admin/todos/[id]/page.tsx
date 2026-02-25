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
import { Label } from "@repo/ui/web/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/web/components/ui/select";
import { updateTodoSchema } from "@repo/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileWarning, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>;

export default function AdminTodoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const todoId = resolvedParams.id;

  const { data: todo, isLoading } = useQuery(
    orpc.admin.getTodo.queryOptions({ input: { id: todoId } }),
  );

  const form = useForm<UpdateTodoFormValues>({
    resolver: zodResolver(updateTodoSchema),
    values: {
      title: todo?.title || "",
      completed: todo?.completed || false,
    },
  });

  const updateTodoMutation = useMutation(
    orpc.admin.updateTodo.mutationOptions({
      onSuccess: () => {
        toast.success("Todo Model updated safely");
        queryClient.invalidateQueries({ queryKey: orpc.admin.getTodo.key() });
        queryClient.invalidateQueries({ queryKey: orpc.admin.getTodos.key() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to update record");
      },
    }),
  );

  const { isDirty } = form.formState;

  const onSubmit = (values: UpdateTodoFormValues) => {
    updateTodoMutation.mutate({ id: todoId, ...values });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <FileWarning className="h-12 w-12 text-zinc-400" />
        <h2 className="text-xl font-bold">Todo Record Missing</h2>
        <Button onClick={() => router.push("/admin/todos")}>Return to Database</Button>
      </div>
    );
  }

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
            Edit Database Todo
          </h2>
          <p className="text-sm text-zinc-500">Node ID: {todo.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modification Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Parent User Allocation ID</Label>
                  <Input
                    value={todo.userId}
                    disabled
                    className="bg-zinc-50 dark:bg-zinc-900/50 font-mono text-sm"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>String Model Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 border-t dark:border-zinc-800">
                  <FormField
                    control={form.control}
                    name="completed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completed Status</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(val === "true")}
                          defaultValue={field.value ? "true" : "false"}
                        >
                          <FormControl>
                            <SelectTrigger id="completed" className="w-full bg-background">
                              <SelectValue placeholder="Select completion status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">Pending</SelectItem>
                            <SelectItem value="true">Completed</SelectItem>
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
                <Button type="submit" disabled={!isDirty || updateTodoMutation.isPending}>
                  {updateTodoMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Commit to Database
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
