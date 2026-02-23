import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { Button, Text } from "@repo/ui/mobile";
import { loginSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Stack, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, TextInput, View } from "react-native";
import type { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { data: session } = authClient.useSession();

  React.useEffect(() => {
    if (session) {
      router.replace("/(app)");
    }
  }, [session, router]);

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) throw new Error(error.message || "Invalid credentials");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.replace("/(app)");
    },
    onError: (error) => {
      Alert.alert("Login Failed", error.message);
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 w-full rounded-md border bg-background px-3 text-foreground ${
                    errors.email ? "border-destructive" : "border-input"
                  }`}
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="text-xs text-destructive">{errors.email.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 w-full rounded-md border bg-background px-3 text-foreground ${
                    errors.password ? "border-destructive" : "border-input"
                  }`}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && (
              <Text className="text-xs text-destructive">{errors.password.message}</Text>
            )}
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loginMutation.isPending}
            className="mt-4"
          >
            <Text>{loginMutation.isPending ? "Signing in..." : "Sign In"}</Text>
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
