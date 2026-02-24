import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { authClient } from "@repo/auth/client";
import type { Todo } from "@repo/types";
import { Button, Checkbox, Icon, Input, Text } from "@repo/ui/mobile";
import { insertTodoSchema } from "@repo/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import type { z } from "zod";
import { ThemeSwitch } from "@/components/ThemeSwitch";

type TodoFormValues = z.infer<typeof insertTodoSchema>;

export default function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
          title: "Tasks",
          headerTitleStyle: { fontSize: 20, fontWeight: "600" },
          headerShadowVisible: false,
          headerRight: () => (
            <>
              <Button variant="ghost" size="sm" onPress={handleSignout}>
                <Text className="text-primary font-semibold">Log Out</Text>
              </Button>
              <ThemeSwitch />
            </>
          ),
        }}
      />
      <View className="flex-1 bg-background px-6 pt-6">
        <View className="flex-row gap-3 mb-8 items-start">
          <View className="flex-1">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={errors.title ? "border-destructive" : ""}
                  placeholder="What needs to be done?"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType="done"
                />
              )}
            />
            {errors.title && (
              <Text className="mt-1 text-sm text-destructive font-medium">
                {errors.title.message}
              </Text>
            )}
          </View>
          <Button onPress={handleSubmit(onSubmit)} size="icon" className="shrink-0">
            <Icon as={Plus} className="text-primary-foreground size-6" />
          </Button>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {todos.length === 0 ? (
            <Text className="text-center text-muted-foreground mt-10 text-base">
              No tasks yet. Create one!
            </Text>
          ) : (
            <View className="pb-10">
              {todos.map((todo: Todo, index: number) => (
                <View
                  key={todo.id}
                  className={`flex-row items-center justify-between py-5 border-b border-border/50 ${
                    index === 0 ? "border-t border-border/50" : ""
                  } ${todo.completed ? "opacity-50 bg-muted/50 px-2" : "px-2"}`}
                >
                  <View className="flex-row items-center flex-1 gap-4 pr-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                    />
                    <Text
                      className={`flex-1 text-lg ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {todo.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTodo(todo.id)}
                    className="p-3 -mr-3"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
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
