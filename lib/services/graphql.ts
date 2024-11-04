import { GraphQLClient } from "graphql-request"
import { env } from "@/config/env.mjs"

// Type for client names to ensure consistency
export type GraphQLClientName = 'snapshot' | 'psyc' | 'psycMainnet' | 'shopify'

// Configuration for each client
const clientConfigs = {
  snapshot: {
    url: env.NEXT_PUBLIC_SNAPSHOT_GRAPHQL_URL,
    headers: {}
  },
  psyc: {
    url: env.NEXT_PUBLIC_SUBGRAPH_URL,
    headers: {}
  },
  psycMainnet: {
    url: env.NEXT_PUBLIC_MAINNET_SUBGRAPH_URL,
    headers: {}
  },
  shopify: {
    url: '/api/shopify-proxy',
    headers: {}
  }
} as const

// Create clients object
const clients: Record<GraphQLClientName, GraphQLClient> = {
  snapshot: new GraphQLClient(clientConfigs.snapshot.url),
  psyc: new GraphQLClient(clientConfigs.psyc.url),
  psycMainnet: new GraphQLClient(clientConfigs.psycMainnet.url),
  shopify: new GraphQLClient(clientConfigs.shopify.url)
}

// Type-safe query function
export async function gqlQuery<T>({
  client,
  query,
  variables
}: {
  client: GraphQLClientName
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  try {
    return await clients[client].request<T>(query, variables)
  } catch (error) {
    console.error(`GraphQL ${client} query error:`, error)
    throw error
  }
} 