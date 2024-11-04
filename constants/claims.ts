import { env } from "@/config/env.mjs";

const NEXT_PUBLIC_SUBGRAPH_URL = env.NEXT_PUBLIC_SUBGRAPH_URL;
const NEXT_PUBLIC_MAINNET_SUBGRAPH_URL = env.NEXT_PUBLIC_MAINNET_SUBGRAPH_URL;
const TEST_ENV = env.TEST_ENV;
const SNAPSHOT_GRAPHQL_URL = env.SNAPSHOT_GRAPHQL_URL;

export {
  NEXT_PUBLIC_SUBGRAPH_URL,
  NEXT_PUBLIC_MAINNET_SUBGRAPH_URL,
  TEST_ENV,
  SNAPSHOT_GRAPHQL_URL
};
