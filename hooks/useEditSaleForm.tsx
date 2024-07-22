import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { psycSaleContractConfig } from "@/lib/sale-contract-config";
import { useCustomToasts } from "@/hooks/useCustomToasts";
import { useResize } from "@/hooks/useResize";
import { parseUnits } from "viem";
import { getAddresses, uploadAddresses } from "@/lib/server-utils";
import { getMerkleRoot, getNewAddresses } from "@/utils/saleUtils";
import { useGetCurrentSaleValues } from "./useGetCurrentSaleValues";

export const useEditSaleForm = (
  address: string | undefined,
  setOpenEditSale: React.Dispatch<React.SetStateAction<boolean>>,
  id: string
) => {
  const toast = useToast();
  const { width } = useResize();
  const {
    ceilingPrice: currentCeilingPrice,
    floorPrice: currentFloorPrice,
    ipfsHash: currentIpfsHash
  } = useGetCurrentSaleValues(id, width);
  const { showErrorToast, showSuccessToast } = useCustomToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { isSuccess: floorPriceSuccess, error: floorPriceError } =
    useWaitForTransactionReceipt();
  const { isSuccess: ceilingPriceSuccess, error: ceilingPriceError } =
    useWaitForTransactionReceipt();
  const { isSuccess: whitelistSuccess, error: whitelistError } =
    useWaitForTransactionReceipt();

  const handleEditSale = async (
    e: React.FormEvent<HTMLFormElement>,
    batchID: string,
    addressesToRemove: string[],
    newAddresses: string[],
    existingAddresses: string[],
    newFloorPrice: string,
    newCeilingPrice: string,
    saleStatus: "active" | "complete" | "paused",
    width: number
  ) => {
    e.preventDefault();
    if (!address) {
      toast({
        title: "Please connect your wallet first",
        position: "top-right",
        status: "error",
        isClosable: true
      });
      return;
    }
    setIsSubmitting(true);

    const addressesToSubmit = getNewAddresses(
      addressesToRemove,
      newAddresses,
      existingAddresses
    );

    try {
      const currentAddresses = await getAddresses(currentIpfsHash);
      if (
        parseUnits(newCeilingPrice, 18).toString() === currentCeilingPrice &&
        parseUnits(newFloorPrice, 18).toString() === currentFloorPrice &&
        JSON.stringify(addressesToSubmit.sort()) ===
          JSON.stringify(currentAddresses.sort())
      ) {
        showErrorToast("No changes to submit!", width);
        setIsSubmitting(false);
        return;
      }
      console.log(
        currentFloorPrice,
        currentCeilingPrice,
        newFloorPrice,
        newCeilingPrice
      );
      if (
        JSON.stringify(addressesToSubmit.sort()) !==
        JSON.stringify(currentAddresses.sort())
      ) {
        const newIpfsHash = await uploadAddresses(addressesToSubmit);
        const newMerkleRoot = getMerkleRoot(addressesToSubmit);
        await writeContractAsync({
          ...psycSaleContractConfig,
          functionName: "updateMerkleRoot",
          args: [batchID, newMerkleRoot, newIpfsHash]
        });
      }
      if (parseUnits(newFloorPrice, 18).toString() !== currentFloorPrice) {
        await writeContractAsync({
          ...psycSaleContractConfig,
          functionName: "changeFloorPriceOfBatch",
          args: [batchID, parseUnits(newFloorPrice, 18)]
        });
      }
      if (parseUnits(newCeilingPrice, 18).toString() !== currentCeilingPrice) {
        await writeContractAsync({
          ...psycSaleContractConfig,
          functionName: "changeCeilingPriceOfBatch",
          args: [batchID, parseUnits(newCeilingPrice, 18)]
        });
      }

      // TODO: contracts are being redeployed, change these to correct function names later
      // if (!isPaused && saleStatus === "paused") {
      // writeContract({
      //   ...psycSaleContractConfig,
      //   functionName: "pause"
      // });
      // console.log("pause sale");
      // } else if (isPaused && saleStatus === "active") {
      // writeContract({
      //   ...psycSaleContractConfig,
      //   functionName: "unpause"
      // });
      // console.log("unpause sale");
      // }
    } catch (error) {
      const message = (error as Error).message || "An error occurred";
      setIsSubmitting(false);
      console.error(message, "error");
      console.log(message);
      if (message.includes("Invalid Price")) {
        showErrorToast("Ceiling price cannot be less than floor price", width);
        setIsSubmitting(false);
      } else if (message.includes("User rejected")) {
        showErrorToast("Transaction rejected by user", width);
        setIsSubmitting(false);
      } else {
        showErrorToast(message, width);
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (ceilingPriceError ?? floorPriceError ?? whitelistError) {
      console.log("error!");
      const errorMessage =
        ceilingPriceError?.message ??
        floorPriceError?.message ??
        whitelistError?.message ??
        "An error occurred";
      if (errorMessage.includes("user rejected")) {
        showErrorToast("Transaction rejected by user", width);
        setIsSubmitting(false);
        return;
      }
      if (errorMessage.includes("invalid price")) {
        showErrorToast("Ceiling price cannot be less than floor price", width);
        setIsSubmitting(false);
        return;
      }
      showErrorToast(errorMessage, width);
      console.error(errorMessage, "error");
      setIsSubmitting(false);
      return;
    }

    if (ceilingPriceSuccess || floorPriceSuccess || whitelistSuccess) {
      showSuccessToast("Success! This sale has been edited.", width);
      setIsSubmitting(false);
      setOpenEditSale(false);
      return;
    }
  }, [
    floorPriceError,
    floorPriceSuccess,
    ceilingPriceError,
    ceilingPriceSuccess,
    whitelistError,
    whitelistSuccess,
    width,
    showErrorToast,
    showSuccessToast,
    setOpenEditSale
  ]);

  return {
    handleEditSale,
    isSubmitting
  };
};