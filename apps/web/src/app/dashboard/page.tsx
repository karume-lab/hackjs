"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">
            HackJS Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle>Welcome to HackJS</CardTitle>
            <CardDescription>A premium fullstack monorepo starter.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              This dashboard is ready for your custom implementation. Start by adding your own
              features!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
