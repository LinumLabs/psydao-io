import { Box, Flex } from "@chakra-ui/react";
import TsCsPartOne from "./TsCsPartOne";
import TsCsPartTwo from "./TsCsPartTwo";
import TsCsPartThree from "./TsCsPartThree";

const TermsAndConditionsContent = () => {
  return (
    <Box
      p={{ base: "8px", md: "16px" }}
      background={"#FBE7E8"}
      borderRadius={"16px"}
    >
      <Flex
        h={"100%"}
        direction={"column"}
        maxH={{ base: "230px", md: "300px", lg: "325px" }}
        color={"#591D6D"}
        overflowY={"scroll"}
        justifyContent={"flex-start"}
        textAlign={"start"}
        paddingRight={{ base: "8px", md: "16px" }}
        gap={{ base: "8px", md: "16px" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "11px"
          },
          "&::-webkit-scrollbar-track": {
            width: "8px",
            background: "white",
            borderRadius: "24px",
            border: "1px solid #F2BEBE"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#F2BEBE",
            border: "1.5px solid transparent",
            backgroundClip: "padding-box",
            borderRadius: "24px",
            width: "6px"
          }
        }}
      >
        <TsCsPartOne />
        <TsCsPartTwo />
        <TsCsPartThree />
      </Flex>
    </Box>
  );
};

export default TermsAndConditionsContent;
