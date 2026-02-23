import { client } from "@repo/api/client";
import { authClient } from "@repo/auth/client";
import { router, Stack } from "expo-router";
import { CheckIcon, TrashIcon } from "lucide-react-native";
import * as React from "react";
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export default function DashboardScreen() {
  const [todos, setTodos] = React.useState<any[]>([]);
  const [newTodo, setNewTodo] = React.useState("");

  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await client.todos.getTodos();
      setTodos(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const added = await client.todos.createTodo({
        title: newTodo,
        completed: false,
      });
      setTodos((prev) => [added[0], ...prev]);
      setNewTodo("");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not add todo");
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      await client.todos.updateTodo({ id, completed: !completed });
    } catch (e) {
      console.error(e);
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await client.todos.deleteTodo({ id });
    } catch (e) {
      console.error(e);
      fetchTodos();
    }
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
        <View className="flex-row gap-2 mb-6">
          <TextInput
            className="flex-1 h-12 rounded-lg border border-input bg-background px-4 text-foreground"
            placeholder="Add a new task..."
            placeholderTextColor="#9CA3AF"
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={handleAddTodo}
          />
          <Button onPress={handleAddTodo} className="h-12 px-6">
            <Text>Add</Text>
          </Button>
        </View>

        <ScrollView className="flex-1">
          {todos.length === 0 ? (
            <Text className="text-center text-muted-foreground mt-10">
              No tasks yet. Create one!
            </Text>
          ) : (
            <View className="gap-3">
              {todos.map((todo) => (
                <View
                  key={todo.id}
                  className={`flex-row items-center justify-between p-4 rounded-xl border border-border bg-card \${todo.completed ? 'opacity-60' : ''}`}
                >
                  <View className="flex-row items-center flex-1 gap-3 pr-4">
                    <TouchableOpacity
                      onPress={() => handleToggleTodo(todo.id, todo.completed)}
                      className={`h-6 w-6 rounded-full border items-center justify-center \${todo.completed ? 'border-primary bg-primary' : 'border-muted-foreground'}`}
                    >
                      {todo.completed && (
                        <Icon as={CheckIcon} className="text-primary-foreground size-3.5" />
                      )}
                    </TouchableOpacity>
                    <Text
                      className={`flex-1 text-card-foreground text-base \${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.title}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)} className="p-2">
                    <Icon as={TrashIcon} className="text-destructive size-5" />
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
