import { Checkbox, Flex, Image, Show, Text } from "@chakra-ui/react";
import LinearButton from "components/linear-button";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import TermsAndConditionsContent from "../terms-and-conditions/TermsAndConditionsContent";

interface SwapTsAndCsType {
  setTermsAndConditions: Dispatch<SetStateAction<boolean>>;
}

export const SwapTsAndCs = ({ setTermsAndConditions }: SwapTsAndCsType) => {
  const [showTerms, setShowTerms] = useState(false);
  const [userHasAccepted, setUserHasAccepted] = useState(false);
  const handleAccept = () => {
    setTermsAndConditions(true);
    localStorage.setItem("acceptedTermsAndConditions", "true");
  };

  return (
    <Flex
      direction={"column"}
      h={"full"}
      gap={{ base: 4, sm: 6 }}
      alignItems={"center"}
      justifyContent={"center"}
      px={{ base: 2, sm: 4 }}
    >
      <Flex
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
        gap={4}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          textAlign={"center"}
          color={"#269200"}
          whiteSpace={"nowrap"}
          flexWrap={"nowrap"}
        >
          <Text
            fontSize={{ base: "18px", sm: "30px", md: "48px" }}
            fontFamily={"Amiri"}
            fontStyle={"italic"}
          >
            To Participate in our Token Sale,
          </Text>
          <Flex
            fontSize={{ base: "14px", sm: "18px", md: "24px" }}
            fontFamily={"Amiri"}
            fontStyle={"italic"}
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
            gap={1}
          >
            Please Read and Accept our{" "}
            <Show breakpoint="(max-width: 380px)">
              <br />
            </Show>
            <Text
              cursor={"pointer"}
              whiteSpace={"nowrap"}
              textDecoration={"underline"}
              textUnderlineOffset={"8px"}
              onClick={() => setShowTerms(true)}
              color={showTerms ? "#269200" : "#9835BA"}
            >
              Terms and Conditions
            </Text>
            .
          </Flex>
        </Flex>
      </Flex>
      {showTerms ? (
        <TermsAndConditionsContent />
      ) : (
        <Image
          src="/windows/swap/terms-conditions.png"
          alt="Terms and conditions background"
          objectFit={"fill"}
        />
      )}
      <Flex
        w={"full"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Flex gap={3}>
          <Checkbox
            colorScheme="purple"
            onChange={() => setUserHasAccepted((prev) => !prev)}
            isChecked={userHasAccepted}
          />
          <label htmlFor="accept-terms-checkbox">
            <Text
              color={"#374151"}
              fontFamily={"Poppins"}
              fontSize={{ base: "10px", sm: "14px" }}
            >
              I have read the T&Cs
            </Text>
          </label>
        </Flex>
        <LinearButton
          customStyle={{ width: "fit-content" }}
          onClick={handleAccept}
          isDisabled={!userHasAccepted}
        >
          <Text
            fontSize={{ base: "10px", sm: "18px" }}
            padding={{ base: "8px 16px", sm: "20px" }}
          >
            I Accept
          </Text>
        </LinearButton>
      </Flex>
    </Flex>
  );
};
