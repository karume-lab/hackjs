import { RootProvider } from "fumadocs-ui/provider/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "fumadocs-ui/style.css";
import "@repo/ui/web/globals.css";
import { Toaster } from "@repo/ui/web/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SEOConfig, { metadataConfig } from "@/components/shared/SEOConfig";

export const metadata: Metadata = metadataConfig;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <NuqsAdapter>
              <SEOConfig />
              <RootProvider>{children}</RootProvider>
              <Toaster richColors />
            </NuqsAdapter>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
