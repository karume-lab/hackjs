import { Button } from "@repo/ui/mobile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { CheckCircle2, Circle, ListTodo, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { api } from "@/lib/api";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string | Date;
}

export default function TodosScreen() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["mobile-todos"],
    queryFn: async () => {
      const { data, error } = await api.todos.get();
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await api.todos.post({ title });
      if (error) throw error;
      return data;
    },
    onSuccess: (created) => {
      if (created) {
        queryClient.setQueryData(["mobile-todos"], (old: Todo[] | undefined) =>
          old ? [created, ...old] : [created],
        );
        setNewTodo("");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (err) => {
      console.error(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const { error } = await api.todos({ id }).patch({ completed: !completed });
      if (error) throw error;
      return { id, completed: !completed };
    },
    onSuccess: ({ id, completed }) => {
      queryClient.setQueryData(["mobile-todos"], (old: Todo[] | undefined) =>
        old?.map((t) => (t.id === id ? { ...t, completed } : t)),
      );
    },
    onError: (err) => {
      console.error(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { error } = await api.todos({ id }).delete();
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["mobile-todos"], (old: Todo[] | undefined) =>
        old?.filter((t) => t.id !== id),
      );
    },
    onError: (err) => {
      console.error(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const onRefresh = () => {
    refetch();
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    addMutation.mutate(newTodo);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Momentum",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
          headerRight: () => (
            <View className="flex-row items-center">
              <ThemeSwitch />
              <SignOutButton />
            </View>
          ),
        }}
      />

      <View className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Tasks</Text>
          <Text className="text-muted-foreground mt-1">
            {todos.filter((t) => !t.completed).length} items remaining
          </Text>
        </View>

        <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-2 mb-6 shadow-sm">
          <TextInput
            className="flex-1 h-12 text-foreground text-lg"
            placeholder="Add a new task..."
            placeholderTextColor="#888"
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={addTodo}
          />
          <Button
            onPress={addTodo}
            loading={addMutation.isPending}
            disabled={!newTodo.trim()}
            size="icon"
            className="rounded-xl w-10 h-10"
          >
            <Plus size={24} color="white" />
          </Button>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeInRight}
              exiting={FadeOutLeft}
              layout={LinearTransition.springify()}
              className={`flex-row items-center bg-card border border-border mb-3 p-4 rounded-2xl shadow-sm ${item.completed ? "opacity-60" : ""}`}
            >
              <TouchableOpacity
                onPress={() => toggleMutation.mutate({ id: item.id, completed: item.completed })}
                className="mr-4"
              >
                {item.completed ? (
                  <View className="bg-primary rounded-full p-1">
                    <CheckCircle2 size={18} color="white" />
                  </View>
                ) : (
                  <Circle size={26} color="#888" />
                )}
              </TouchableOpacity>

              <Text
                className={`flex-1 text-lg font-medium text-foreground ${item.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {item.title}
              </Text>

              <Button
                onPress={() => deleteMutation.mutate(item.id)}
                variant="ghost"
                size="icon"
                loading={deleteMutation.isPending && deleteMutation.variables === item.id}
              >
                <Trash2 size={20} color="#ff4444" />
              </Button>
            </Animated.View>
          )}
          ListEmptyComponent={() =>
            !isLoading && (
              <View className="items-center justify-center py-20">
                <ListTodo size={64} color="#888" opacity={0.3} />
                <Text className="text-muted-foreground mt-4 text-center">
                  No tasks found. Add your first task above!
                </Text>
              </View>
            )
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      />
    </View>
  );
}
