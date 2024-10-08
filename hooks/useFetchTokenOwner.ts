import { useQuery } from "@apollo/client";
import { getTokensOwners } from "@/services/graph";
import type { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";

interface TokenOwnerData {
  tokens: { id: string; owner: string }[];
}

interface TokenOwnerVars {
  ids: string[];
}

interface UseFetchTokenOwnerResult {
  owners: { id: string; owner: string }[];
  loading: boolean;
  error: ApolloError | undefined;
}

const useFetchTokenOwners = (
  contractAddress: string,
  tokenIds: string[]
): UseFetchTokenOwnerResult => {
  const lowerCasedContractAddress = contractAddress.toLowerCase();
  const ids = tokenIds.map(
    (tokenId) => `${lowerCasedContractAddress}/${tokenId}`
  );

  const { data, loading, error } = useQuery<TokenOwnerData, TokenOwnerVars>(
    getTokensOwners,
    {
      variables: { ids }
    }
  );

  const [owners, setOwners] = useState<{ id: string; owner: string }[]>([]);

  useEffect(() => {
    if (data?.tokens) {
      setOwners(data.tokens);
    }
  }, [data]);

  return { owners, loading, error };
};

export default useFetchTokenOwners;
