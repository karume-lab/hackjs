import { authClient } from "@repo/auth/client";
import { Link, router, Stack } from "expo-router";
import * as React from "react";
import { Alert, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        Alert.alert("Login Failed", error.message || "Invalid credentials");
      } else {
        router.replace("/(app)");
      }
    } catch (e: unknown) {
      const message = (e as { message?: string })?.message || "An error occurred";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign In", headerTitle: "Sign In" }} />
      <View className="flex-1 justify-center p-6 bg-background">
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-foreground">Welcome to Ease</Text>
          <Text className="text-muted-foreground mt-2">Sign in to manage your tasks</Text>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Email</Text>
            <TextInput
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Password</Text>
            <TextInput
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button onPress={handleLogin} disabled={loading} className="mt-4">
            <Text>{loading ? "Signing in..." : "Sign In"}</Text>
          </Button>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-muted-foreground">Don't have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <Text className="font-semibold text-primary">Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
