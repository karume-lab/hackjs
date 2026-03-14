import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { ListTodo } from "lucide-react";
import Link from "next/link";
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

      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8 grid gap-6">
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

        <Link href="/dashboard/todos">
          <Card className="shadow-sm border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="group-hover:text-indigo-500 transition-colors">
                  Goal Tracker
                </CardTitle>
                <CardDescription>Manage your personal tasks and todos.</CardDescription>
              </div>
              <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500 transition-all">
                <ListTodo className="w-6 h-6 text-indigo-500 group-hover:text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-indigo-500 font-medium">
                Go to Tasks →
              </div>
            </CardContent>
          </Card>
        </Link>
      </main>
    </div>
  );
}
