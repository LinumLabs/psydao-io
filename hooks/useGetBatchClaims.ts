import { BatchClaim } from "@/lib/types";
import { getBatchClaims } from "@/services/graph";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient
} from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

export const useGetBatchClaims = () => {
  const [refetchClaims, setRefetchClaims] = useState<boolean>(false);
  const [claims, setClaims] = useState<BatchClaim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await client.query({
        query: getBatchClaims,
        fetchPolicy: "network-only"
      });

      if (data && data.batchClaims) {
        setClaims(data.batchClaims);
      } else {
        setClaims([]);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void fetchClaims();

    const claimsIntervalId = setInterval(() => {
      void fetchClaims();
    }, 20000);

    return () => clearInterval(claimsIntervalId);
  }, [fetchClaims]);

  const refetch = async () => {
    await fetchClaims();
  };

  return { claims, loading, error, refetch };
};
