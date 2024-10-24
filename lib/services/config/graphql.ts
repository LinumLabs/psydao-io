
import { GraphQLClient } from 'graphql-request';
import { env } from "process";

export const snapshotGraphQLClient = new GraphQLClient(env.SNAPSHOT_GRAPHQL_URL as string);
export const psycGraphQLClient = new GraphQLClient(env.PSYC_SUBGRAPH_URL as string);
