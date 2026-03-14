import { Icon } from "@repo/ui/mobile/components/ui/icon";
import { Input } from "@repo/ui/mobile/components/ui/input";
import { cn } from "@repo/ui/mobile/lib/utils";
import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";

function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View className="relative w-full">
      <Input secureTextEntry={!showPassword} className={cn("pr-12", className)} {...props} />
      <TouchableOpacity
        onPress={() => setShowPassword((prev) => !prev)}
        disabled={props.editable === false}
        className="absolute right-0 top-0 bottom-0 aspect-square items-center justify-center"
        activeOpacity={0.7}
      >
        <Icon as={showPassword ? EyeOff : Eye} className="text-muted-foreground size-5" />
      </TouchableOpacity>
    </View>
  );
}

export { PasswordInput };
