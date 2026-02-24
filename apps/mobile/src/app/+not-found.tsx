import { Button, Text } from "@repo/ui/mobile";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

export default function NotFoundScreen() {
  const router = useRouter();
  const foreground = useCSSVariable("--color-foreground");

  return (
    <>
      <Stack.Screen options={{ title: "404", headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-full max-w-md items-center bg-card border border-border shadow-md rounded-xl p-6 sm:p-10 gap-6">
            <Image
              source={require("@repo/assets/not-found.svg")}
              style={{ width: 240, height: 240 }}
              contentFit="contain"
            />

            <View className="items-center gap-2 px-2">
              <Text className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">
                404 - Page Not Found
              </Text>
              <Text className="text-sm sm:text-base text-muted-foreground text-center">
                Oops! The page you're looking for doesn't exist or has been moved.
              </Text>
            </View>

            <Button
              variant="outline"
              className="mt-2 w-full flex-row items-center justify-center sm:w-auto"
              onPress={() => router.back()}
            >
              <ArrowLeft size={16} color={foreground as string} className="mr-2" />
              <Text>Go Back</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
