import { Box, Flex, TabIndicator, Text } from "@chakra-ui/react";
import { WhitepaperLink } from "../commons/whitepaper-link";
import { PrivateSaleSwitch } from "../commons/privatesale-switch";
import NftSaleTabs from "./nft-sale-tabs";

const MintPsycHeader = () => {
  // TODO: Hide toggle if user is not whitelisted
  const IS_WHITELISTED = true;

  return (
    <Box px={{ base: 2, md: 4 }} py={2} position={"relative"}>
      <Flex justifyContent={"start"} direction={"column"} gap={"10px"}>
        <Flex
          alignItems={{ base: "start", md: "center" }}
          justifyContent={"space-between"}
          gap={2}
          flexWrap={"wrap"}
        >
          <NftSaleTabs />
          <WhitepaperLink />
        </Flex>
        {IS_WHITELISTED && <PrivateSaleSwitch />}
      </Flex>
    </Box>
  );
};

export default MintPsycHeader;
