import { Box, Flex, Image, Text } from "@chakra-ui/react";
import LinearButton from "components/linear-button";
import TermsAndConditionsModal from "components/modals/TsAndCs";
import React, { Dispatch, SetStateAction, useState } from "react";

interface SwapTsAndCsType {
  setTermsAndConditions: Dispatch<SetStateAction<boolean>>;
}

export const SwapTsAndCs = ({ setTermsAndConditions }: SwapTsAndCsType) => {
  const [openModal, setOpenModal] = useState(false);

  const handleAccept = () => {
    setTermsAndConditions(true);
    localStorage.setItem("acceptedTermsAndConditions", "true");
  };

  return (
    <>
      <Flex
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
        pb={6}
        gap={4}
      >
        <Box flexDirection={"column"}>
          <Text
            textColor="#9835BA"
            fontSize={{ base: "20px", sm: "32px" }}
            fontFamily={"Amiri"}
          >
            Before you start
          </Text>
          <Text
            textColor="#9835BA"
            fontSize={{ base: "16px", sm: "20px" }}
            fontFamily={"Amiri"}
          >
            Please read and accept our{" "}
            <Text
              as={"u"}
              cursor={"pointer"}
              onClick={() => setOpenModal(true)}
            >
              Terms and Conditions
            </Text>{" "}
            to proceed.
          </Text>
        </Box>
        <LinearButton
          customStyle={{ width: "fit-content", padding: "20px" }}
          onClick={handleAccept}
        >
          I Accept
        </LinearButton>
      </Flex>
      <Image
        src="/windows/swap/restricted-countries.png"
        alt="Restricted countries background"
      />
      <TermsAndConditionsModal
        isOpen={openModal}
        onClose={() => setOpenModal((prev) => !prev)}
        onAccept={handleAccept}
      />
    </>
  );
};
