import { generateOGImage } from "@/lib/og";

export const size = {
  width: 1200,
  height: 675,
};

export const contentType = "image/png";

const twitterImage = async () => {
  return generateOGImage(size);
};

export default twitterImage;
