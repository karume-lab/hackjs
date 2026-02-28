import { pubOS } from "@repo/api/os";
import { adminRouter } from "@repo/api/routers/admin";

export const router = pubOS.router({
  admin: adminRouter,
});
