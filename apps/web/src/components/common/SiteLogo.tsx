import Logo from "@repo/assets/logo.png";
import Image from "next/image";

const SiteLogo = () => {
  return <Image alt="HackJS Logo" src={Logo} width={50} height={50} />;
};

export default SiteLogo;
