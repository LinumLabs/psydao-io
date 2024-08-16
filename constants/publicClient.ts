import { env } from "@/config/env.mjs";
import { createPublicClient, http } from "viem";
import { mainnet } from "wagmi/chains";

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(env.NEXT_PUBLIC_MAINNET_CLIENT)
});
