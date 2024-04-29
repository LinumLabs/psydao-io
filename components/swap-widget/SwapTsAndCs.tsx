import { Box, Checkbox, Flex, GridItem, Show, Text } from "@chakra-ui/react";
import LinearButton from "components/linear-button";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import TermsAndConditionsContent from "../terms-and-conditions/TermsAndConditionsContent";

interface SwapTsAndCsType {
  setTermsAndConditions: Dispatch<SetStateAction<boolean>>;
}

export const SwapTsAndCs = ({ setTermsAndConditions }: SwapTsAndCsType) => {
  const [userHasAccepted, setUserHasAccepted] = useState(false);
  const handleAccept = () => {
    setTermsAndConditions(true);
    localStorage.setItem("acceptedTermsAndConditions", "true");
  };

  return (
    <Box
      display={{ base: "grid", md: "flex" }}
      flexDirection={"column"}
      gap={4}
      alignItems={"center"}
      px={{ base: 2, sm: 4 }}
      h={"100%"}
      css={{
        "@media (max-height: 779px)": {
          gridTemplateRows: "0.4fr 1fr 0.5fr"
        },
        "@media (min-height: 780px)": {
          gridTemplateRows: "0.5fr 1fr 0.6fr"
        },
        "@media (min-height: 850px)": {
          gridTemplateRows: "0.6fr 1fr 0.5fr"
        }
      }}
    >
      <GridItem>
        <Flex
          flexWrap={"wrap"}
          alignItems={"center"}
          direction={"column"}
          gap={4}
          flex={1}
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
              fontSize={{ base: "18px", sm: "30px", lg: "48px" }}
              lineHeight={{ base: "22px", sm: "34px", lg: "48px" }}
              fontFamily={"Amiri"}
              fontStyle={"italic"}
            >
              To Participate in our Token Sale,
            </Text>
            <Flex
              fontSize={{ base: "14px", sm: "18px", md: "20px", lg: "22px" }}
              lineHeight={{ base: "14px", sm: "18px", md: "20px", lg: "22px" }}
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
                whiteSpace={"nowrap"}
                // textDecoration={"underline"}
                // textUnderlineOffset={"8px"}
                color={"#269200"}
              >
                Terms and Conditions
              </Text>
              .
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
      <GridItem>
        <Box>
          <TermsAndConditionsContent />
        </Box>
      </GridItem>
      <GridItem w={"full"}>
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
              id="accept-terms-checkbox"
            />
            <label htmlFor="accept-terms-checkbox">
              <Text
                color={"#374151"}
                fontFamily={"Poppins"}
                fontSize={{ base: "10px", sm: "14px" }}
                cursor={"pointer"}
              >
                I have read the T&Cs
              </Text>
            </label>
          </Flex>
          <LinearButton
            customStyle={{ width: "100%" }}
            onClick={handleAccept}
            isDisabled={!userHasAccepted}
            isAccept={true}
          >
            <Text
              fontSize={{ base: "10px", sm: "18px" }}
              padding={{ base: "8px 16px", sm: "18px" }}
            >
              I Accept
            </Text>
          </LinearButton>
        </Flex>
      </GridItem>
    </Box>
  );
};
