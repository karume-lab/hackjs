import type { LucideIcon, LucideProps } from "lucide-react-native";
import { withUniwind } from "uniwind";
import { cn } from "../../lib/utils";

type IconProps = LucideProps & {
  as: LucideIcon;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = withUniwind(IconImpl, {
  size: {
    fromClassName: "className",
    styleProperty: "width",
  },
  color: {
    fromClassName: "className",
    styleProperty: "color",
  },
});

function Icon({ as: IconComponent, className, ...props }: IconProps) {
  return (
    <StyledIcon as={IconComponent} className={cn("text-foreground size-5", className)} {...props} />
  );
}

export { Icon };
export type { IconProps };
