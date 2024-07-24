import React, { useEffect, useState, useMemo } from "react";
import { Box, Flex, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { getAllSalesWithTokens } from "@/services/graph";
import type { TokenItem, GetAllSalesWithTokensData, Sale } from "@/lib/types";
import { formatUnits } from "viem";
import PsycItem from "../../psyc-item";
import useRandomImage from "@/hooks/useRandomImage";
import { getAddresses } from "@/lib/server-utils";

interface MintSectionProps {
  isRandom: boolean;
  selectedSale: Sale | undefined;
}

interface WhitelistedTokenItem extends TokenItem {
  whitelist: string[];
}

const MintSection = ({
  isRandom,
  selectedSale: selectedSale
}: MintSectionProps) => {
  const { loading, error, data } = useQuery<GetAllSalesWithTokensData>(
    getAllSalesWithTokens
  );

  useEffect(() => {
    console.log(data?.sales, "sales");
  }, [data]);

  const images = useMemo(() => {
    if (!selectedSale) return [];
    return selectedSale.tokensOnSale.map(
      (_, index) => `/psyc${(index % 3) + 1}.webp`
    );
  }, [selectedSale]);

  const currentImageIndex = useRandomImage(isRandom, images);
  const [randomToken, setRandomToken] = useState<WhitelistedTokenItem | null>(
    null
  );
  const [whitelist, setWhitelist] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (selectedSale) {
      const fetchWhitelist = async () => {
        try {
          const addresses = await getAddresses(selectedSale.ipfsHash);
          setWhitelist((prev) => ({
            ...prev,
            [selectedSale.ipfsHash]: addresses
          }));
        } catch (error) {
          console.error("Error fetching whitelist addresses:", error);
        }
      };
      fetchWhitelist().catch((error) => {
        console.error("Error fetching whitelist:", error);
      });
    }
  }, [selectedSale]);

  const activeTokens = useMemo(() => {
    if (!selectedSale) return [];
    return selectedSale.tokensOnSale.map((token, index) => ({
      src: images[index] ?? "",
      price: `${formatUnits(BigInt(selectedSale.floorPrice), 18)}`,
      isSold: false,
      batchId: selectedSale.batchID,
      tokenId: token.tokenID,
      ipfsHash: selectedSale.ipfsHash,
      whitelist: whitelist[selectedSale.ipfsHash] ?? []
    }));
  }, [selectedSale, images, whitelist]);

  useEffect(() => {
    if (isRandom && activeTokens.length > 0) {
      setRandomToken(
        activeTokens[currentImageIndex % activeTokens.length] ?? null
      );
    }
  }, [activeTokens, currentImageIndex, isRandom]);

  if (loading) return <Box textAlign="center">Loading...</Box>;
  if (error) return <Box textAlign="center">Error loading data</Box>;

  return (
    <Box textAlign="center" py={4} px={4}>
      {isRandom && randomToken ? (
        <Flex justifyContent="center">
          <PsycItem
            item={randomToken}
            index={currentImageIndex}
            isRandom={true}
            isPrivateSale={true}
            loading={loading}
          />
        </Flex>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(auto-fit, minmax(170px, 1fr))"
          }}
          gap={6}
        >
          {selectedSale?.tokensOnSale.map((token, index) => (
            <PsycItem
              isPrivateSale={true}
              key={token.id}
              item={{
                src: `/psyc${(index % 3) + 1}.webp`,
                price: `${formatUnits(BigInt(selectedSale.ceilingPrice), 18)}`,
                isSold: false,
                batchId: selectedSale.batchID,
                tokenId: token.tokenID,
                ipfsHash: selectedSale.ipfsHash,
                whitelist: whitelist[selectedSale.ipfsHash] ?? []
              }}
              index={parseInt(token.id, 10)}
              isRandom={isRandom}
              loading={loading}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MintSection;
