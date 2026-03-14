import { authClient } from "@repo/auth/client";
import { Button, Text } from "@repo/ui/mobile";
import { useRouter } from "expo-router";
import * as React from "react";

interface SignOutButtonProps {
  children?: React.ReactNode;
}

export function SignOutButton({ children = "Sign Out" }: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await authClient.signOut();
      router.replace("/(auth)/sign-in");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button onPress={handleSignOut} loading={isPending}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Button>
  );
}
