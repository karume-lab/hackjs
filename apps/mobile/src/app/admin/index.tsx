import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-8 flex-1">
        <Text className="text-2xl font-bold text-foreground">Admin Panel</Text>
      </View>
    </SafeAreaView>
  );
}
