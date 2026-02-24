import { Button, Text } from "@repo/ui/mobile";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>Onboarding</Text>
      <Button onPress={() => router.push("/(auth)/sign-in")}>
        <Text>Sign in</Text>
      </Button>
    </SafeAreaView>
  );
}
