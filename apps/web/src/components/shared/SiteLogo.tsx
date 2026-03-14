import Logo from "@repo/assets/logo.png";
import { cn } from "@repo/ui/web/lib/utils";
import Image from "next/image";

const SiteLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      alt="HackJS Logo"
      src={Logo}
      className={cn("rounded-2xl bg-black dark:bg-transparent", className)}
      priority={true}
    />
  );
};

export default SiteLogo;
