import { Tab, TabList } from "@chakra-ui/react";

const NftSaleTabs = () => {
  return (
    <TabList display={"flex"} gap={6}>
      <Tab
        textColor={"#5C5C5C"}
        fontWeight="500"
        fontStyle="italic"
        fontSize={{ base: "12px", sm: "24px" }}
        lineHeight={{ base: "12px", sm: "24px" }}
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
      <Tab
        textColor={"#5C5C5C"}
        fontWeight="500"
        fontStyle="italic"
        fontSize={{ base: "12px", sm: "24px" }}
        lineHeight={{ base: "12px", sm: "24px" }}
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
    </TabList>
  );
};

export default NftSaleTabs;
