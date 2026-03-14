import { Suspense } from "react";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  );
};

export default SignUpPage;
