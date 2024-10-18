import { client } from "@/utils/apolloClient";
import { gql, useQuery } from "@apollo/client";

const GET_USER_ORDERS = gql`
  query getUserOrders($query: String!) {
    ordersCount(query: $query) {
      count
    }
  }
`;

const useGetUserOrders = (addressSnippet: string) => {
  const { data, error } = useQuery(GET_USER_ORDERS, {
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
