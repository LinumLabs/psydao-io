import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  server: {
    CHAINALYSIS_API_KEY: z.string(),
    PINATA_API_KEY: z.string(),
    PINATA_SECRET_API_KEY: z.string(),
    PINATA_JWT: z.string()
  },
  client: {
    NEXT_PUBLIC_IS_MAINNET: z.boolean(),
    NEXT_PUBLIC_APP_NAME: z.string(),
    NEXT_PUBLIC_CHAIN_ID: z.string(),
    NEXT_PUBLIC_MIXPANEL_ID: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_SUBGRAPH_URL: z.string(),
    NEXT_PUBLIC_PINATA_BASE_URL: z.string(),
    NEXT_PUBLIC_ETHERSCAN_BASE_URL: z.string(),
    NEXT_PUBLIC_MAINNET_CLIENT: z.string(),
    NEXT_PUBLIC_WHITELISTED_ADDRESSES: z.string()
  },
  runtimeEnv: {
    CHAINALYSIS_API_KEY: process.env.CHAINALYSIS_API_KEY,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    PINATA_JWT: process.env.PINATA_JWT,
    NEXT_PUBLIC_IS_MAINNET: Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_MIXPANEL_ID: process.env.NEXT_PUBLIC_MIXPANEL_ID,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_SUBGRAPH_URL:
      Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1
        ? process.env.NEXT_PUBLIC_SUBGRAPH_URL_MAINNET
        : process.env.NEXT_PUBLIC_SUBGRAPH_URL_SEPOLIA,
    NEXT_PUBLIC_PINATA_BASE_URL: process.env.NEXT_PUBLIC_PINATA_BASE_URL,
    NEXT_PUBLIC_ETHERSCAN_BASE_URL:
      Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1
        ? process.env.NEXT_PUBLIC_MAINNET_ETHERSCAN_BASE_URL
        : process.env.NEXT_PUBLIC_SEPOLIA_ETHERSCAN_BASE_URL,
    NEXT_PUBLIC_WHITELISTED_ADDRESSES:
      process.env.NEXT_PUBLIC_WHITELISTED_ADDRESSES,
    NEXT_PUBLIC_MAINNET_CLIENT: process.env.NEXT_PUBLIC_MAINNET_CLIENT
  }
});
