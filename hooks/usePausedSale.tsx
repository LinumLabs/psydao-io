import { psycSaleContractConfig } from "@/lib/sale-contract-config";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

type SaleBatchesReturn = [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  boolean
];

const usePausedSale = (saleId: string) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [saleBatches, setSaleBatches] = useState<SaleBatchesReturn | undefined>(
    undefined
  );
  const [isPausedContractDataLoading, setIsPausedContractDataLoading] =
    useState<boolean>(true);

  const { data, isError, isLoading } = useReadContract({
    ...psycSaleContractConfig,
    functionName: "saleBatches",
    args: [saleId]
  });
  useEffect(() => {
    if (data && !isLoading) {
      setSaleBatches(data as SaleBatchesReturn);
    }

    if (saleBatches && !isLoading) {
      setIsPaused(saleBatches[6]);
      setIsPausedContractDataLoading(false);
    }
  }, [data, saleBatches, isLoading]);

  useEffect(() => {
    if (isError) {
      setIsPausedContractDataLoading(false);
      console.error("Error fetching sale status");
    }
  });

  return { isPaused, isError, isPausedLoading: isPausedContractDataLoading };
};

export default usePausedSale;
