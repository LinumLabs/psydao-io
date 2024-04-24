import { Flex } from "@chakra-ui/react";
import TsCsPartOne from "./TsCsPartOne";
import TsCsPartTwo from "./TsCsPartTwo";
import TsCsPartThree from "./TsCsPartThree";

const TermsAndConditionsContent = () => {
  return (
    <Flex
      h={"100%"}
      direction={"column"}
      maxH={"360px"}
      borderRadius={"16px"}
      background={"#FBE7E8"}
      color={"#591D6D"}
      overflowY={"scroll"}
      justifyContent={"flex-start"}
      textAlign={"start"}
      padding={"24px 16px 16px 16px"}
      gap={"16px"}
    >
      <TsCsPartOne />
      <TsCsPartTwo />
      <TsCsPartThree />
    </Flex>
  );
};

export default TermsAndConditionsContent;
