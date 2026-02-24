"use client";

import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NotFoundIllustration from "~/public/not-found.svg";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:p-8 sm:pt-10">
          <Image
            alt="Not found illustration"
            src={NotFoundIllustration}
            width={240}
            height={240}
            className="object-contain sm:w-[300px] sm:h-[300px]"
            priority
          />
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              404 - Page Not Found
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:text-base px-2">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button onClick={() => router.back()} variant="outline" className="mt-2 w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
