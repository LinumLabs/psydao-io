import { env } from "process";
import { useCallback } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { psyClaimsMainnet, psyClaimsSepolia } from "@/constants/contracts";
import psyClaimsAbi from "@/abis/psyClaimsAbi.json";

export const useCreateNewClaimableBatch = () => {
  const { data, writeContract, isPending, error, reset, isError, isSuccess } =
    useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: txError
  } = useWaitForTransactionReceipt({
    hash: data
  });

  const createNewClaimableBatch = useCallback(
    async (merkleRoot: string, deadline: string, ipfsHash: string) => {
      return writeContract({
        address: env.NEXT_PUBLIC_IS_MAINNET
          ? psyClaimsMainnet
          : psyClaimsSepolia,
        functionName: "createNewClaimableBatch",
        abi: env.NEXT_PUBLIC_IS_MAINNET ? psyClaimsAbi : psyClaimsAbi,
        args: [merkleRoot, BigInt(deadline), ipfsHash]
      });
    },
    [writeContract]
  );

  return {
    createNewClaimableBatch,
    isConfirmed: isConfirmed && isSuccess,
    isConfirming,
    isPending,
    error,
    createBatchError: isError,
    resetBatchCreate: reset,
    createBatchTxError: txError
  };
};
