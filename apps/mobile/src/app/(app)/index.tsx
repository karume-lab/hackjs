import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { authClient } from "@repo/auth/client";
import type { Todo } from "@repo/types";
import { Button, Icon, Text } from "@repo/ui/mobile";
import { insertTodoSchema } from "@repo/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useCSSVariable } from "uniwind";
import type { z } from "zod";

type TodoFormValues = z.infer<typeof insertTodoSchema>;

export default function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutedForeground = useCSSVariable("--color-muted-foreground");
  const primaryForeground = useCSSVariable("--color-primary-foreground");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const { data: todos = [] } = useQuery(orpc.todos.getTodos.queryOptions());
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/(auth)/login");
    }
  }, [isSessionLoading, session, router]);

  const { mutate: createTodo } = useMutation(
    orpc.todos.createTodo.mutationOptions({
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
      },
      onError: (e) => {
        console.error(e);
        Alert.alert("Error", "Could not add todo");
      },
    }),
  );

  const onSubmit = (values: TodoFormValues) => {
    createTodo({ title: values.title, completed: false });
  };

  const { mutate: toggleTodo } = useMutation(
    orpc.todos.updateTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
      },
      onError: (e) => {
        console.error(e);
      },
    }),
  );

  const handleToggleTodo = (id: string, completed: boolean) => {
    toggleTodo({ id, completed: !completed });
  };

  const { mutate: deleteTodo } = useMutation(
    orpc.todos.deleteTodo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
      },
      onError: (e) => {
        console.error(e);
      },
    }),
  );

  const handleDeleteTodo = (id: string) => {
    deleteTodo({ id });
  };

  const handleSignout = async () => {
    await authClient.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerRight: () => (
            <Button variant="ghost" onPress={handleSignout}>
              <Text className="text-primary font-medium">Log Out</Text>
            </Button>
          ),
        }}
      />
      <View className="flex-1 bg-background p-4">
        <View className="flex-row gap-2 mb-8 items-start">
          <View className="flex-1">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 w-full rounded-md border bg-background px-3 text-foreground ${
                    errors.title ? "border-destructive" : "border-input"
                  }`}
                  placeholder="What needs to be done?"
                  placeholderTextColor={mutedForeground as string}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />
            {errors.title && (
              <Text className="mt-1 text-xs text-destructive">{errors.title.message}</Text>
            )}
          </View>
          <Button onPress={handleSubmit(onSubmit)}>
            <Icon as={Plus} size={20} color={primaryForeground as string} />
          </Button>
        </View>

        <ScrollView className="flex-1">
          {todos.length === 0 ? (
            <Text className="text-center text-muted-foreground mt-10">
              No tasks yet. Create one!
            </Text>
          ) : (
            <View className="gap-3">
              {todos.map((todo: Todo) => (
                <View
                  key={todo.id}
                  className={`flex-row items-center justify-between p-4 rounded-xl border border-border bg-card ${todo.completed ? "opacity-60" : ""}`}
                >
                  <View className="flex-row items-center flex-1 gap-3 pr-4">
                    <TouchableOpacity
                      onPress={() => handleToggleTodo(todo.id, todo.completed)}
                      className={`h-6 w-6 rounded-full border items-center justify-center ${todo.completed ? "border-primary bg-primary" : "border-muted-foreground"}`}
                    >
                      {todo.completed && (
                        <Icon as={Check} className="text-primary-foreground size-3.5" />
                      )}
                    </TouchableOpacity>
                    <Text
                      className={`flex-1 text-card-foreground text-base ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.title}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)} className="p-2">
                    <Icon as={Trash2} className="text-destructive size-5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
