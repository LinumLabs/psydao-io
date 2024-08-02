import { psycSaleContractConfig } from "@/lib/sale-contract-config";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

const useGetBaseUri = () => {
  const [baseUri, setBaseUri] = useState<string | undefined>(undefined);
  const { data, isError, isLoading } = useReadContract({
    ...psycSaleContractConfig,
    functionName: "baseURI"
  });

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setBaseUri(data as string);
    }
  }, [data]);

  return {
    baseUri,
    isError
  };
};

export default useGetBaseUri;
