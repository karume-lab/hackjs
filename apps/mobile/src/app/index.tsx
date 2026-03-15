import { Redirect } from "expo-router";

export default function OnboardingScreen() {
  return <Redirect href="/(auth)/sign-in" />;
}
