import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const twitterImage = async (): Promise<ImageResponse> => {
  const logo = `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`;

  return new ImageResponse(
    <div tw="flex flex-col items-center justify-center w-full h-full bg-black text-white p-12">
      <div tw="flex flex-col items-center">
        {/* biome-ignore lint/performance/noImgElement: required for next/og */}
        <img
          src={logo}
          alt="HackJS Logo"
          width="200"
          height="200"
          style={{ marginBottom: "40px" }}
        />
        <h1 tw="text-8xl font-bold mb-4">HackJS</h1>
        <p tw="text-3xl text-gray-400">The Ultimate Monorepo Stack</p>
      </div>
    </div>,
    {
      ...size,
    },
  );
};

export default twitterImage;
