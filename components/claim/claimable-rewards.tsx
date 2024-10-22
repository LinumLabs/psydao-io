import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import ClaimCard from "./claim-card";
import { dummyData } from "./dummyData";
import { type ClaimStatus } from "@/lib/types";
import { useWizard } from "react-use-wizard";
import { fetchMerkleProof } from "@/utils/getMerkleProof";
import { useGetBatchClaims } from "@/hooks/useGetBatchClaims";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";

interface ClaimableRewardsProps {
  isAdmin: boolean;
}

const ClaimableRewards: React.FC<ClaimableRewardsProps> = ({ isAdmin }) => {
  const { nextStep } = useWizard();
  const { claims } = useGetBatchClaims();
  const [batchId, setBatchId] = useState("1");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatchData = async (): Promise<{
    data?: any;
    error?: any;
  }> => {
    try {
      const response = await fetch("/api/merkle-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: '0xfeEb9546E9501f03aEc345fb4fbC8E255048C67d',
          ipfsHash: 'QmTAPt6cT5aW4z1jLJA2bANSx3K6ra4u6VrGruqGpApm6E',
          batchId: '1'
        })
      });
  
      if (!response.ok) {
        const result = await response.json();
        console.error("Error:", result.error);
        return { error: result.error };
      }
  
      const result = await response.json();
      console.log(result);
      return { data: result };
    } catch (error) {
      console.error("Error calling API:", error);
      return { error };
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatchData()
        .then((result) => {
          setData(result.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [batchId]);

  console.log({ data });

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
          {/* add href to claim creation */}
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
        {claims.map((item, index) => {
          return (
            <ClaimCard
              key={index}
              amount={item.amount}
              claimStatus={"claimable"}
              batchNumber={parseInt(item.id) + 1}
              expiry={item.deadline}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

export default ClaimableRewards;
