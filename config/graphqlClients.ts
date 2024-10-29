import { env } from "@/config/env.mjs";
import { SNAPSHOT_GRAPHQL_URL } from "@/constants/claims";
import { GraphQLClient } from "graphql-request";

export const snapshotGraphQLClient = new GraphQLClient(
  SNAPSHOT_GRAPHQL_URL as string
);
export const psycGraphQLClient = new GraphQLClient(
  env.NEXT_PUBLIC_SUBGRAPH_URL as string
);
