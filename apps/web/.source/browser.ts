// @ts-nocheck
import { browser } from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>();
const browserCollections = {
  docs: create.doc("docs", {
    "architecture.mdx": () => import("../content/docs/architecture.mdx?collection=docs"),
    "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"),
    "adr/adr-001-orpc.md": () => import("../content/docs/adr/adr-001-orpc.md?collection=docs"),
    "adr/adr-002-better-auth.md": () =>
      import("../content/docs/adr/adr-002-better-auth.md?collection=docs"),
    "adr/adr-003-drizzle-orm.md": () =>
      import("../content/docs/adr/adr-003-drizzle-orm.md?collection=docs"),
    "adr/adr-004-turborepo-bun.md": () =>
      import("../content/docs/adr/adr-004-turborepo-bun.md?collection=docs"),
    "adr/adr-005-nextjs.md": () => import("../content/docs/adr/adr-005-nextjs.md?collection=docs"),
    "adr/adr-006-expo-router.md": () =>
      import("../content/docs/adr/adr-006-expo-router.md?collection=docs"),
    "adr/adr-007-scalar-openapi.md": () =>
      import("../content/docs/adr/adr-007-scalar-openapi.md?collection=docs"),
    "adr/adr-008-state-management.md": () =>
      import("../content/docs/adr/adr-008-state-management.md?collection=docs"),
    "adr/adr-009-zod-validation.md": () =>
      import("../content/docs/adr/adr-009-zod-validation.md?collection=docs"),
    "adr/adr-010-tailwind-shadcn.md": () =>
      import("../content/docs/adr/adr-010-tailwind-shadcn.md?collection=docs"),
    "adr/adr-011-biome.md": () => import("../content/docs/adr/adr-011-biome.md?collection=docs"),
  }),
};
export default browserCollections;
