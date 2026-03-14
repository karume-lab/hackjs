import { authClient } from "@repo/auth/client";
import { Stack, useRouter } from "expo-router";
import { ListTodo } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
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
      <View className="flex-1 bg-muted/30 px-4 sm:px-6 pt-6">
        <View className="items-center justify-center mb-10">
          <Text className="text-2xl font-bold text-foreground">Welcome to HackJS</Text>
          <Text className="text-muted-foreground mt-2">
            Start building your amazing project here.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/dashboard/todos")}
          className="bg-card border border-border rounded-2xl p-6 flex-row items-center shadow-sm"
        >
          <View className="bg-primary/10 p-3 rounded-xl mr-4">
            <ListTodo size={24} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">Goal Tracker</Text>
            <Text className="text-muted-foreground">Manage your personal tasks.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
