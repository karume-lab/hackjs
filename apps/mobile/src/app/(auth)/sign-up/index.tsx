import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@repo/auth/client";
import { Button, Text } from "@repo/ui/mobile";
import { signUpSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";
import type { z } from "zod";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutedForeground = useCSSVariable("--color-muted-foreground");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (error) throw new Error(error.message || "Could not create account");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.replace("/dashboard");
    },
    onError: (error) => {
      Alert.alert("Signup Failed", error.message);
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUpMutation.mutate(values);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign Up", headerTitle: "Sign Up" }} />
      <View className="flex-1 justify-center p-6 bg-background">
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-foreground">Create Account</Text>
          <Text className="text-muted-foreground mt-2">Join Taskly to organize your life</Text>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 w-full rounded-md border bg-background px-3 text-foreground ${
                    errors.name ? "border-destructive" : "border-input"
                  }`}
                  placeholder="John Doe"
                  placeholderTextColor={mutedForeground as string}
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && <Text className="text-xs text-destructive">{errors.name.message}</Text>}
          </View>

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
                  placeholderTextColor={mutedForeground as string}
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
                  placeholderTextColor={mutedForeground as string}
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
            disabled={signUpMutation.isPending}
            className="mt-4"
          >
            <Text>{signUpMutation.isPending ? "Creating..." : "Sign Up"}</Text>
          </Button>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-muted-foreground">Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <Text className="font-semibold text-primary">Sign in</Text>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
