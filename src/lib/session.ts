import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "./auth";

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});

export const getUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});
