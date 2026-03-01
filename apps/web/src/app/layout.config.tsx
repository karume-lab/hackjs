import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <span className="font-bold tracking-tight md:[header_&]:hidden">hackjs</span>,
    transparentMode: "none",
  },
  links: [
    {
      text: "API Reference",
      url: "/docs/api/reference",
      active: "nested-url",
    },
  ],
};
