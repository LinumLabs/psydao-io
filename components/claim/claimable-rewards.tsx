import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import ClaimCard from "./claim-card";
import { useWizard } from "react-use-wizard";
import { useGetBatchClaims } from "@/hooks/useGetBatchClaims";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

interface ClaimableRewardsProps {
  isAdmin: boolean;
}

type MappedClaimData = {
  id: string;
  claims: [];
  batchId: string;
  ipfsHash: string;
  merkleRoot: string;
  amount: string;
  claimed: boolean;
  deadline: string;
  merkleProof: string[];
  buttonDisabled: boolean;
  reason: string;
};

const EmptyState = () => {
  return (
    <Flex
      gap={8}
      direction={"column"}
      p={{
        base: "4",
        md: "8"
      }}
    >
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        border={"1px solid rgba(242,190,190,0.45)"}
        borderRadius={"20px"}
        w={"fit-content"}
        marginX={"auto"}
        padding={{
          base: "4",
          md: "6"
        }}
      >
        <Text
          fontSize={{
            base: "16px",
            md: "18px"
          }}
        >
          No claimable rewards yet
        </Text>
      </Flex>
    </Flex>
  );
};

const ClaimableRewards: React.FC<ClaimableRewardsProps> = ({ isAdmin }) => {
  const { nextStep } = useWizard();
  const data = useGetBatchClaims();
  const [mappedData, setMappedData] = useState<MappedClaimData[]>([]);
  const { address } = useAccount();

  const fetchMappedData = async (): Promise<{
    data?: any;
    error?: any;
  }> => {
    const cleanedClaimsArray = data.map(({ __typename, ...rest }) => rest);
    try {
      const response = await fetch("/api/mapped-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          claims: cleanedClaimsArray,
          address: address
        })
      });

      if (!response.ok) {
        const result = await response.json();
        console.error("Error:", result.error);
        return { error: result.error };
      }

      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error("Error calling API:", error);
      return { error };
    }
  };

  useEffect(() => {
    if (data && address) {
      fetchMappedData()
        .then((result) => {
          setMappedData(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [address, data]);

  if (!mappedData) {
    return null;
  }

  return (
    <Box>
      <Flex
        px={{ base: "4", md: "8" }}
        alignItems={"center"}
        justifyContent={"space-between"}
        borderBottom={"1px solid #E9BDBD"}
      >
        <Flex
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          direction={"row"}
          gap={1.5}
          py={6}
        >
          <Text
            as="h2"
            fontSize={{ base: "20px", sm: "24px" }}
            lineHeight={{ base: "20px", sm: "24px" }}
          >
            Claimable Rewards
          </Text>
          {isAdmin && (
            <Button
              h={"100%"}
              py={{ base: 2, md: 3 }}
              px={{ base: 2, md: 4 }}
              w={"100%"}
              maxW={{ base: "106px", sm: "138px" }}
              display={"flex"}
              justifyContent={"center"}
              bg={"#AF52DE26"}
              borderRadius={"50px"}
              color={"#AF52DE"}
              fontFamily={"Inter Medium"}
              fontSize={{ base: 12, md: 14 }}
              _hover={{ textDecoration: "none" }}
              onClick={nextStep}
            >
              Create claims
            </Button>
          )}
        </Flex>
      </Flex>

      <Grid
        templateColumns={{
          base: "minmax(170px, 1fr)",
          sm: "repeat(auto-fit, minmax(170px, 1fr))"
        }}
        gap={2}
        justifyItems="center"
        maxW="100%"
        padding={{ base: "4", md: "8" }}
      >
        {mappedData.length > 0 ? (
          mappedData.map((item, index) => {
            return (
              <ClaimCard
                key={index}
                amount={item.amount}
                claimStatus={
                  item.claimed
                    ? "claimed"
                    : item.buttonDisabled
                      ? "expired"
                      : "claimable"
                }
                batchId={item.batchId}
                expiry={item.deadline}
                onClaim={() => {}}
                proof={item.merkleProof}
                text={item.reason}
                disabled={item.buttonDisabled}
              />
            );
          })
        ) : (
          <EmptyState />
        )}
      </Grid>
    </Box>
  );
};

export default ClaimableRewards;
