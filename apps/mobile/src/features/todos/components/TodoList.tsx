import { orpc } from "@repo/api/client";
import type { Todo } from "@repo/types";
import { Text } from "@repo/ui/mobile";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { TodoItem } from "@/features/todos/components/TodoItem";

export function TodoList() {
  const { data: todos = [] } = useQuery(orpc.todos.getTodos.queryOptions());

  return (
    <ScrollView className="flex-1 max-w-2xl mx-auto w-full" showsVerticalScrollIndicator={false}>
      {todos.length === 0 ? (
        <Text className="text-center text-muted-foreground mt-10 text-base">
          No tasks yet. Create one!
        </Text>
      ) : (
        <View className="pb-10">
          {todos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
