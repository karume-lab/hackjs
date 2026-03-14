"use client";

import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export const SignOutButton = ({
  variant = "secondary",
  size = "default",
  className = "",
  showIcon = false,
  label = "Sign out",
}: SignOutButtonProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      loading={isPending}
      className={className}
    >
      {showIcon && <LogOut className="mr-2" />}
      {label}
    </Button>
  );
};
