import Logo from "@repo/assets/logo.png";
import Image from "next/image";

const SiteLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      alt="HackJS Logo"
      src={Logo}
      className={className}
      style={{ height: "100%", width: "auto" }}
    />
  );
};

export default SiteLogo;
