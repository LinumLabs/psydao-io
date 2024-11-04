import { shopifyApolloClient } from "@/config/apolloClients";
import { getUserOrders } from "@/services/graph";

import { useQuery } from "@apollo/client";

const useGetUserOrders = (addressSnippet: string) => {
  const { data, error } = useQuery(getUserOrders, {
    client: shopifyApolloClient,
    variables: { query: `discount_code:${addressSnippet}` },
    pollInterval: 10_000
  });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return { data, error };
};

export default useGetUserOrders;
