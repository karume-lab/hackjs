import { Suspense } from "react";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
