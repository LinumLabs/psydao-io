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
        justifyContent={"center"}
        direction={"column"}
        pb={6}
        gap={4}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          textAlign={"center"}
          color={"#269200"}
        >
          <Text
            fontSize={{ base: "20px", md: "48px" }}
            fontFamily={"Amiri"}
            fontStyle={"italic"}
          >
            Before you start
          </Text>
          <Text
            fontSize={{ base: "16px", md: "24px" }}
            fontFamily={"Amiri"}
            fontStyle={"italic"}
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
        </Flex>
        <LinearButton
          customStyle={{ width: "fit-content", padding: "20px" }}
          onClick={handleAccept}
        >
          <Text fontSize={{ base: "14px", md: "18px" }}>I Accept</Text>
        </LinearButton>
      </Flex>
      <Image
        src="/windows/swap/terms-conditions.png"
        alt="Terms and conditions background"
        objectFit={"fill"}
      />
      <TermsAndConditionsModal
        isOpen={openModal}
        onClose={() => setOpenModal((prev) => !prev)}
        onAccept={handleAccept}
      />
    </>
  );
};