import Logo from "@repo/assets/logo.png";
import { cn } from "@repo/ui/web/lib/utils";
import Image from "next/image";

/**
 * The primary brand logo component for the HackJS application.
 * Automatically handles dark/light mode background adjustments.
 *
 * @param className - Optional CSS classes to apply to the logo image
 */
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
