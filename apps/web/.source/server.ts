// @ts-nocheck

import { server } from "fumadocs-mdx/runtime/server";
import * as __fd_glob_3 from "../content/docs/adr/adr-001-orpc.md?collection=docs";
import * as __fd_glob_4 from "../content/docs/adr/adr-002-better-auth.md?collection=docs";
import * as __fd_glob_5 from "../content/docs/adr/adr-003-drizzle-orm.md?collection=docs";
import * as __fd_glob_6 from "../content/docs/adr/adr-004-turborepo-bun.md?collection=docs";
import * as __fd_glob_7 from "../content/docs/adr/adr-005-nextjs.md?collection=docs";
import * as __fd_glob_8 from "../content/docs/adr/adr-006-expo-router.md?collection=docs";
import * as __fd_glob_9 from "../content/docs/adr/adr-007-scalar-openapi.md?collection=docs";
import * as __fd_glob_10 from "../content/docs/adr/adr-008-state-management.md?collection=docs";
import * as __fd_glob_11 from "../content/docs/adr/adr-009-zod-validation.md?collection=docs";
import * as __fd_glob_12 from "../content/docs/adr/adr-010-tailwind-shadcn.md?collection=docs";
import * as __fd_glob_13 from "../content/docs/adr/adr-011-biome.md?collection=docs";
import { default as __fd_glob_0 } from "../content/docs/adr/meta.json?collection=docs";
import * as __fd_glob_1 from "../content/docs/architecture.mdx?collection=docs";
import * as __fd_glob_2 from "../content/docs/getting-started.mdx?collection=docs";
import type * as Config from "../source.config";

const create = server<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>({ doc: { passthroughs: ["extractedReferences"] } });

export const docs = await create.docs(
  "docs",
  "content/docs",
  { "adr/meta.json": __fd_glob_0 },
  {
    "architecture.mdx": __fd_glob_1,
    "getting-started.mdx": __fd_glob_2,
    "adr/adr-001-orpc.md": __fd_glob_3,
    "adr/adr-002-better-auth.md": __fd_glob_4,
    "adr/adr-003-drizzle-orm.md": __fd_glob_5,
    "adr/adr-004-turborepo-bun.md": __fd_glob_6,
    "adr/adr-005-nextjs.md": __fd_glob_7,
    "adr/adr-006-expo-router.md": __fd_glob_8,
    "adr/adr-007-scalar-openapi.md": __fd_glob_9,
    "adr/adr-008-state-management.md": __fd_glob_10,
    "adr/adr-009-zod-validation.md": __fd_glob_11,
    "adr/adr-010-tailwind-shadcn.md": __fd_glob_12,
    "adr/adr-011-biome.md": __fd_glob_13,
  },
);
