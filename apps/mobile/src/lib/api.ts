import { createClient } from "@repo/api/client";
import { getBaseUrl } from "@repo/utils";

const client = createClient(getBaseUrl());

export const api = client.api;
