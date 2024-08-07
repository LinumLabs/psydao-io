import { Flex, Tab, TabList } from "@chakra-ui/react";
import { useAccount } from "wagmi";

type NftSaleTabsProps = {
  numberOfOwnedNfts: number;
};

const NftSaleTabs = (props: NftSaleTabsProps) => {
  const { address } = useAccount();

  return (
    <TabList display={"flex"} gap={6}>
      <Tab
        textColor={"#5C5C5C"}
        fontWeight="500"
        fontSize={{ base: "16px", sm: "24px" }}
        lineHeight={{ base: "30px", sm: "36px" }}
        fontFamily={"Amiri"}
        _selected={{
          textColor: "#269200",
          textDecoration: "underline",
          textUnderlineOffset: "8px"
        }}
        p={0}
      >
        Mint PSYC
      </Tab>
      {address && (
        <Flex gap={2} alignItems={"center"}>
          <Tab
            textColor={"#5C5C5C"}
            fontWeight="500"
            fontSize={{ base: "16px", sm: "24px" }}
            lineHeight={{ base: "30px", sm: "36px" }}
            fontFamily={"Amiri"}
            _selected={{
              textColor: "#269200",
              textDecoration: "underline",
              textUnderlineOffset: "8px"
            }}
            p={0}
          >
            Owned PSYC
          </Tab>
          <Flex
            borderRadius={"9999px"}
            border={"1px solid #F2BEBE73"}
            fontSize={12}
            padding={"2px 8px"}
            color={"black"}
            textDecoration={"none"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"30px"}
            width={"30px"}
          >
            {props.numberOfOwnedNfts}
          </Flex>
        </Flex>
      )}
    </TabList>
  );
};

export default NftSaleTabs;
