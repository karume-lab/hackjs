import { orpc } from "@repo/api/client";
import type { Todo } from "@repo/types";
import { Checkbox, Icon, Text } from "@repo/ui/mobile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

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

  return (
    <View
      className={`flex-row items-center justify-between py-4 px-5 mb-3 rounded-2xl border border-border/50 bg-card shadow-sm ${
        todo.completed ? "opacity-60 bg-muted/50" : ""
      }`}
    >
      <View className="flex-row items-center flex-1 gap-4 pr-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo({ id: todo.id, completed: !todo.completed })}
          className="rounded-full w-6 h-6"
        />
        <Text
          className={`flex-1 text-lg ${
            todo.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"
          }`}
        >
          {todo.title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteTodo({ id: todo.id })}
        className="p-3 -mr-3"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon as={Trash2} className="text-destructive size-5" />
      </TouchableOpacity>
    </View>
  );
}
