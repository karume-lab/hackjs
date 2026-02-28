import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const twitterImage = async (): Promise<ImageResponse> => {
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div tw="flex flex-col items-center justify-center w-full h-full bg-black text-white p-12">
      <div tw="flex flex-col items-center">
        {/* biome-ignore lint/performance/noImgElement: required for next/og */}
        <img
          src={logoBase64}
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
