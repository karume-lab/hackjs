import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { Button, Input, Label, Text } from "@repo/ui/mobile";
import { signInSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { z } from "zod";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (values: SignInFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) throw new Error(error.message || "Invalid credentials");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.replace("/dashboard" as any);
    },
    onError: (error) => {
      Alert.alert("Sign In Failed", error.message);
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    signInMutation.mutate(values);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign In", headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center p-6 sm:p-12 w-full max-w-md mx-auto">
          <View className="mb-12">
            <Text className="text-4xl font-extrabold tracking-tight mb-2">Welcome to Ease</Text>
            <Text className="text-muted-foreground text-lg">Sign in to manage your tasks</Text>
          </View>

          <View className="gap-6">
            <View className="gap-2.5">
              <Label nativeID="email" className="text-base">
                Email
              </Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    aria-labelledby="email"
                    aria-errormessage={errors.email ? "email-error" : undefined}
                  />
                )}
              />
              {errors.email && (
                <Text nativeID="email-error" className="text-sm text-destructive font-medium mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View className="gap-2.5">
              <Label nativeID="password" className="text-base">
                Password
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="••••••••"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    aria-labelledby="password"
                    aria-errormessage={errors.password ? "password-error" : undefined}
                  />
                )}
              />
              {errors.password && (
                <Text
                  nativeID="password-error"
                  className="text-sm text-destructive font-medium mt-1"
                >
                  {errors.password.message}
                </Text>
              )}
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={signInMutation.isPending}
              className="mt-6"
            >
              <Text>{signInMutation.isPending ? "Signing in..." : "Sign In"}</Text>
            </Button>
          </View>

          <View className="mt-8 flex-row justify-center gap-2 items-center">
            <Text className="text-muted-foreground text-base">Don't have an account?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <Text className="font-bold text-primary text-base">Sign up</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
