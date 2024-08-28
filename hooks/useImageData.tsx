import type { SaleTokensMetadata } from "@/lib/types";
import { getTokensMetadataForASale } from "@/services/graph";
import { useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useTabsContext } from "@chakra-ui/react";
import { useTokenContext } from "@/providers/TokenContext";
import { useSaleWidget } from "@/providers/SaleWidgetContext";
import useGetRandomIds from "./useGetRandomIds";

const FALLBACK_IMAGE = "/psyc3.webp";

const useImageData = (isRandom: boolean) => {
  const { focusedIndex } = useTabsContext();

  const { data: tokenData } = useTokenContext();

  const { activeSale, isOriginal } = useSaleWidget();

  const availableRandomIds = useGetRandomIds(activeSale, isRandom, isOriginal);

  const tokenIds = useMemo(() => {
    return focusedIndex === 0
      ? isRandom && availableRandomIds.length > 0
        ? availableRandomIds
        : activeSale?.tokensOnSale.map((token) => token.tokenID) ?? []
      : tokenData?.tokens.map((token) => token.tokenId) ?? [];
  }, [activeSale, availableRandomIds, focusedIndex, tokenData]);
  const [imageUris, setImageUris] = useState<string[]>([]);

  const { data, loading, error } = useQuery<SaleTokensMetadata>(
    getTokensMetadataForASale,
    {
      variables: {
        tokenIds: tokenIds
      },
      skip: tokenIds.length === 0 || !tokenIds
    }
  );

  const memoizedTokenIds = useMemo(() => tokenIds, [tokenIds]);

  useEffect(() => {
    if (data && data.tokens.length > 0) {
      setImageUris(
        data.tokens.map((token) => token.metadata?.imageURI || FALLBACK_IMAGE)
      );
    } else {
      setImageUris(Array(tokenIds.length).fill(FALLBACK_IMAGE));
    }
  }, [data, memoizedTokenIds]);

  return { imageUris, loading, error };
};

export default useImageData;
