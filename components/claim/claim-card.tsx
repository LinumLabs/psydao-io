import { useCustomToasts } from "@/hooks/useCustomToasts";
import { useResize } from "@/hooks/useResize";
import { type ClaimStatus } from "@/lib/types";
import { useClaim } from "@/services/web3/useClaim";
import { getExpirationStatus } from "@/utils/getExpirationStatus";
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export interface ClaimCardProps {
  amount: string;
  claimStatus: ClaimStatus;
  batchId: string;
  expiry: string;
  totalClaimable?: string;
  onClaim?: () => void;
  proof?: string[];
  text: string;
  disabled?: boolean;
}

const ClaimCardText = ({ text }: { text: string }) => (
  <Text
    fontFamily={"Inter Medium"}
    textTransform={"capitalize"}
    fontSize={{
      sm: "12px",
      md: "14px"
    }}
    fontWeight={500}
  >
    {text}
  </Text>
);

const ClaimCard = (props: ClaimCardProps) => {
  const { amount, claimStatus, batchId, expiry, proof, text, disabled } = props;
  const { width } = useResize();
  const { showCustomErrorToast, showErrorToast, showSuccessToast } =
    useCustomToasts();

  const {
    claim,
    isSuccess,
    writeContractSuccess,
    isError,
    txError,
    error,
    reset,
    isLoading,
    isPending
  } = useClaim({
    batchId: batchId.toString(),
    amount: amount,
    merkleProof: proof,
    width: width
  });

  useEffect(() => {
    if (isSuccess && writeContractSuccess) {
      showSuccessToast("Claim successful.", width);
      reset();
      return;
    }

    if (txError || isError) {
      showCustomErrorToast(error?.message ?? "", width);
      console.error(error);
      reset();
      return;
    }
  }, [isSuccess, writeContractSuccess, txError, error]);

  return (
    <Flex
      maxW={"593px"}
      mx="auto"
      w="100%"
      direction="column"
      gap={4}
      alignItems="center"
    >
      <Box
        w="100%"
        h={"auto"}
        borderRadius={"20px"}
        overflow="hidden"
        position="relative"
        border="1px solid #E0E0E0"
        onClick={() => true}
        padding={4}
        gap={2}
        fontFamily={"Inter Medium"}
      >
        <ClaimCardText text={`Batch ${batchId.toString()}`} />
        <Divider borderColor={"#E0E0E0"} my={3} />
        <ClaimCardText text={claimStatus} />
        <Text
          fontWeight={700}
          color={claimStatus !== "Claimable" ? "#A9A9A9" : "#AF52DE"}
          fontSize={{
            sm: "14px",
            md: "16px"
          }}
        >
          {parseFloat(amount).toFixed(2)} PSY
        </Text>
        <Divider borderColor={"#E0E0E0"} my={3} />
        <ClaimCardText text={`${getExpirationStatus(expiry)}`} />
        <Box marginTop={4}>
          <Button
            onClick={claim}
            isDisabled={disabled}
            background={
              claimStatus === "Claimable"
                ? "linear-gradient(90deg, #B14CE7 0%, #E09CA4 100%)"
                : "gray.500"
            }
            width={"100%"}
            color={"white"}
            borderRadius={"20px"}
            padding={"10px 36px"}
            fontSize={"14px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            fontFamily={"Poppins Semibold"}
            _hover={{
              opacity: claimStatus === "Claimed" ? "" : "0.8"
            }}
            isLoading={isPending || isLoading}
            loadingText={"Claiming..."}
          >
            {text}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default ClaimCard;
