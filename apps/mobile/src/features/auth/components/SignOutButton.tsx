import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/mobile";
import { useRouter } from "expo-router";

interface SignOutButtonProps {
  children?: React.ReactNode;
}

export function SignOutButton({ children = "Sign Out" }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/(auth)/sign-in");
  };

  return <Button onPress={handleSignOut}>{children}</Button>;
}
