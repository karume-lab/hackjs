import Logo from "@repo/assets/logo.png";
import Image from "next/image";

const SiteLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      alt="HackJS Logo"
      src={Logo}
      className={`rounded-2xl bg-black dark:bg-transparent ${className ?? ""}`}
      style={{ height: "100%", width: "auto" }}
      priority={true}
    />
  );
};

export default SiteLogo;
