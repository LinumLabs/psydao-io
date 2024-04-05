import { useCallback } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { tokenSaleContract } from "constants/tokenSaleContract";
import { parseEther } from "viem";
import tokenSaleAbi from "../../abis/tokenSaleAbi.json";

export const useSendTokenSale = () => {
  const { data, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const sendTokenSale = useCallback(
    async (amountOfPsyTokens: number, ethToSpent: string) => {
      console.log("amountOfPsyTokens", amountOfPsyTokens);
      console.log("ethToSpent", ethToSpent);
      return writeContract({
        address: tokenSaleContract,
        functionName: "buyTokens",
        abi: tokenSaleAbi,
        args: [amountOfPsyTokens],
        value: parseEther(ethToSpent),
      });
    },
    [writeContract]
  );

  console.log("error", error);

  return {
    data,
    sendTokenSale,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
