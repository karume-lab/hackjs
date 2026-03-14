import { cn } from "@repo/ui/mobile/lib/utils";
import { Loader2 } from "lucide-react-native";
import * as React from "react";
import { Animated, Easing } from "react-native";

function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Loader2
        role="status"
        aria-label="Loading"
        className={cn("size-4 text-primary-foreground", className)}
        {...props}
      />
    </Animated.View>
  );
}

export { Spinner };
