import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.EXPO_PUBLIC_APP_URL;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    headers: {
      Origin: baseURL ?? "",
    },
  },
});
