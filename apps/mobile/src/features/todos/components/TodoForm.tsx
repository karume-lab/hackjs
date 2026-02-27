import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { Button, Icon, Input, Text } from "@repo/ui/mobile";
import { insertTodoSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import type { z } from "zod";

type TodoFormValues = z.infer<typeof insertTodoSchema>;

export function TodoForm() {
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

  return (
    <View className="flex-row gap-3 mb-8 items-start max-w-2xl mx-auto w-full">
      <View className="flex-1">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className={`rounded-full h-14 px-6 bg-card shadow-sm ${errors.title ? "border-destructive" : "border-border/50"}`}
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
          <Text className="mt-1 ml-4 text-sm text-destructive font-medium">
            {errors.title.message}
          </Text>
        )}
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        size="icon"
        className="shrink-0 rounded-full h-14 w-14 shadow-sm"
      >
        <Icon as={Plus} className="text-primary-foreground size-6" />
      </Button>
    </View>
  );
}
