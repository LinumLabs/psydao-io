import { getUserOrders } from "@/services/graph";
import { client } from "@/utils/apolloClient";
import { useQuery } from "@apollo/client";

const useGetUserOrders = (addressSnippet: string) => {
  const { data, error } = useQuery(getUserOrders, {
    client: client,
    variables: { query: `discount_code:${addressSnippet}` },
    pollInterval: 10000
  });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return { data, error };
};

export default useGetUserOrders;
