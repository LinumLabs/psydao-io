import { env } from "../../config/env";

export const whitelistedAddresses = env.NEXT_PUBLIC_WHITELISTED_ADDRESSES ?? [];
