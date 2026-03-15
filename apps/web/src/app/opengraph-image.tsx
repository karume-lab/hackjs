import { generateOGImage } from "@/lib/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const openGraphImage = async () => {
  return generateOGImage(size);
};

export default openGraphImage;
