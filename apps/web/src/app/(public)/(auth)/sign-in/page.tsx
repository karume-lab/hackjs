import { Suspense } from "react";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}
