import { authClient } from "@repo/auth/client";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

export default function DashboardScreen() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/(auth)/sign-in");
    }
  }, [isSessionLoading, session, router]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerTitleStyle: { fontSize: 20, fontWeight: "600" },
          headerShadowVisible: false,
          headerRight: () => (
            <>
              <SignOutButton />
              <ThemeSwitch />
            </>
          ),
        }}
      />
      <View className="flex-1 bg-muted/30 px-4 sm:px-6 pt-6 items-center justify-center">
        <Text className="text-2xl font-bold text-foreground">Welcome to HackJS</Text>
        <Text className="text-muted-foreground mt-2">
          Start building your amazing project here.
        </Text>
      </View>
    </>
  );
}
