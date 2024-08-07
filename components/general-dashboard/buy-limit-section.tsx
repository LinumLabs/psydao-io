import { Flex, FormLabel, Input, Box } from "@chakra-ui/react";

type BuyLimitSectionProps = {
  buyLimit: string;
  setBuyLimit: React.Dispatch<React.SetStateAction<string>>;
};

const BuyLimitSection = ({ buyLimit, setBuyLimit }: BuyLimitSectionProps) => {
  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      p={6}
      gap={4}
      borderY="1px"
      alignItems={{ base: "start", sm: "center" }}
      borderColor="#F2BEBE"
      direction={{ base: "column", sm: "row" }}
      flexWrap={"wrap"}
    >
      <FormLabel fontSize="18" htmlFor="buyLimit" mb="0">
        Buy Limit per Address
      </FormLabel>
      <Box
        display="flex"
        bg="#FBF6F8"
        alignItems="center"
        borderRadius="16px"
        boxShadow="-2px 2px 4px 0px #0000001F inset"
        gap={4}
        p="16px"
        w={{ base: "100%", sm: "auto" }}
      >
        <Input
          type="number"
          step={1}
          min={1}
          w={28}
          value={buyLimit}
          onChange={(e) => setBuyLimit(e.target.value)}
          required
          fontSize="22px"
          border={"none"}
          focusBorderColor="transparent"
        />
      </Box>
    </Flex>
  );
};

export default BuyLimitSection;
