"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/web/components/ui/avatar";
import { Button } from "@repo/ui/web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
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
import { type UpdateProfileValues, updateProfileSchema } from "@repo/validators";
import { Camera, Check, Loader2, Mail, ShieldAlert, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AccountProfileClient = () => {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: session?.user.name || "",
      image: session?.user.image || "",
    },
  });

  const onSubmit = async (values: UpdateProfileValues) => {
    setIsUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image,
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      form.reset(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <aside className="space-y-4">
          <Card className="overflow-hidden border-none bg-indigo-600/5 dark:bg-indigo-600/10">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                  <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    {session.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg">{session.user.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {session.user.role || "User"}
                </p>
              </div>
            </CardContent>
          </Card>

          <nav className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start bg-accent/50 text-accent-foreground">
              <User className="mr-2 h-4 w-4" />
              General
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-muted-foreground hover:text-foreground"
              disabled
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Security
            </Button>
          </nav>
        </aside>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and profile picture URL.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} className="pl-10 h-10" placeholder="John Doe" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={session.user.email}
                          disabled
                          className="pl-10 h-10 bg-muted/50 cursor-not-allowed opacity-70"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        Verified account email
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              className="pl-10 h-10"
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end pt-4 border-t border-border/50">
                    <Button
                      type="submit"
                      loading={isUpdating}
                      disabled={!form.formState.isDirty}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] shadow-lg shadow-indigo-500/20"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
