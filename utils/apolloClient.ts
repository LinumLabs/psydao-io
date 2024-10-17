import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/api/shopify-proxy"
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
