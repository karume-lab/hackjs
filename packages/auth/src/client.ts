import { getBaseUrl } from "@repo/utils";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const baseURL = getBaseUrl();

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    headers: {
      Origin: baseURL,
    },
  },
  plugins: [adminClient()],
});
