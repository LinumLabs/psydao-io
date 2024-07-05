import { Box, GridItem, Text, Image, Flex } from "@chakra-ui/react";

const OwnedNftsEmptyState = () => {
  const blep = "";
  return (
    <GridItem gridRowStart={2}>
      <Flex
        p={6}
        borderRadius={"30px"}
        border={"2px solid #F2BEBE73"}
        gap={2.5}
        direction={"column"}
        alignItems={"center"}
        height={"fit-content"}
        width={"fit-content"}
      >
        <Box>
          <Image src={"/windows/nft-sale/psy-logo.svg"} />
        </Box>
        <Text
          fontSize={18}
          color={"black"}
          lineHeight={"26px"}
          textAlign={"center"}
        >
          You don't own any <br /> PSYCs yet{" "}
        </Text>
      </Flex>
    </GridItem>
  );
};

export default OwnedNftsEmptyState;
