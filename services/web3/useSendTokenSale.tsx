import { useCallback } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { tokenSaleContract } from "constants/tokenSaleContract";
import tokenSaleAbi from "../../abis/tokenSaleAbi.json";
import BigNumber from "bignumber.js";

export const useSendTokenSale = () => {
  const { data, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const sendTokenSale = useCallback(
    async (amountOfPsyTokens: number) => {
      return writeContract({
        address: tokenSaleContract,
        functionName: "buyTokens",
        abi: tokenSaleAbi,
        args: [amountOfPsyTokens],
      });
    },
    [writeContract]
  );

  return {
    data,
    sendTokenSale,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
