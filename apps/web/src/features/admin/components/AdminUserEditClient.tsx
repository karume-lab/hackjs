"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateUserSchema } from "@repo/validators";
import dayjs from "dayjs";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAdminUser, useUpdateUserRole } from "@/lib/hooks/use-admin-users";

type UpdateFormValues = z.infer<typeof updateUserSchema>;

export function AdminUserEditClient({ userId }: { userId: string }) {
  const router = useRouter();

  const { data: user, isLoading } = useAdminUser(userId);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: {
      role: (user?.role as "admin" | "user") || "user",
    },
  });

  const updateRoleMutation = useUpdateUserRole();

  const { isDirty } = form.formState;

  const onSubmit = (values: UpdateFormValues) => {
    updateRoleMutation.mutate({ id: userId, role: values.role });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">User Not Found</h2>
        <Button onClick={() => router.push("/admin/users")}>Return to Database</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit System User
          </h2>
          <p className="text-sm text-zinc-500">ID: {user.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={user.name} disabled className="bg-zinc-50 dark:bg-zinc-900/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={user.email} disabled className="bg-zinc-50 dark:bg-zinc-900/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col justify-center">
                    <Label>Verification Status</Label>
                    <span className="text-sm font-medium mt-1">
                      {user.emailVerified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Joined Platform</Label>
                    <Input
                      value={dayjs(user.createdAt).format("MM/DD/YYYY")}
                      disabled
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-zinc-800">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="role" className="w-full bg-background">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">Standard User</SelectItem>
                            <SelectItem value="admin">System Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isDirty || updateRoleMutation.isPending}>
                  {updateRoleMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Permissions
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
