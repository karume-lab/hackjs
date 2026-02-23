import { authClient } from "@repo/auth/client";
import { Redirect } from "expo-router";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootIndex() {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.session) {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
