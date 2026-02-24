import { getBaseUrl } from "@repo/utils";
import { createAuthClient } from "better-auth/react";

const baseURL = getBaseUrl();

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    headers: {
      Origin: baseURL,
    },
  },
});
