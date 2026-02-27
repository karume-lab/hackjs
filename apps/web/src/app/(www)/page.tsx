import { Button } from "@repo/ui/web/components/ui/button";
import Link from "next/link";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-sans text-foreground">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <ThemeSwitch />
      </div>
      <main className="flex w-full max-w-4xl flex-col items-center justify-center p-8 text-center sm:p-24">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
          Manage your tasks with <span className="text-primary">Taskly</span>.
        </h1>
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          The simple, fast, and secure way to keep track of your daily tasks.
        </p>
        <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8 text-base font-medium">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base font-medium"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
