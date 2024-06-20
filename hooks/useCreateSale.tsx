import { generateNftIds } from "@/services/fibonacciSequenceChecks";
import { useCreatePsycSale } from "@/services/web3/useCreatePsycSale";
import { useToast } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const useCreateSale = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { createSale, error, isConfirmed, isConfirming, isPending } =
    useCreatePsycSale();

  if (!address) {
    toast({
      title: "Please connect your wallet first",
      position: "top-right",
      status: "error",
      isClosable: true
    });
    return;
  }

  const createSaleBatch = async (
    batchNumber: number,
    saleStartTime: number,
    floorPrice: number,
    ceilingPrice: number,
    merkleRoot: string,
    ipfsHash: string
  ) => {
    try {
      const lastTokenId = 0; // TODO: get last token id from subgraph
      const nftIds = generateNftIds(batchNumber, lastTokenId);
      await createSale(
        nftIds,
        saleStartTime,
        floorPrice,
        ceilingPrice,
        merkleRoot,
        ipfsHash
      );
      if (isConfirmed) {
        toast({
          title: "Sale created!",
          position: "top-right",
          status: "success",
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong!",
        position: "top-right",
        status: "error",
        isClosable: true
      });
    }
  };

  return {
    createSaleBatch,
    error,
    isConfirmed,
    isConfirming,
    isPending
  };
};
