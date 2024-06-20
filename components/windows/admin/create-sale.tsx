import { useState, useMemo } from "react";

import { Box, Flex, Image, Link, Text, useMediaQuery } from "@chakra-ui/react";
import { Window } from "@/components/window";

import { useRescrictedCountries } from "hooks/restrictedCountries";
import { RestrictedCountries } from "@/components/swap-widget/RestrictedCountries";

import { useWindowManager } from "@/components/window-manager";

const SwapWidgetTitle = () => (
  <Box p={4} pb={8}>
    <Text
      textColor="#269200"
      fontWeight="500"
      fontStyle="italic"
      mt="1"
      fontSize={{ base: "20px", sm: "36px" }}
      lineHeight={{ base: "20px", sm: "36px" }}
      fontFamily={"Amiri"}
    >
      Create Sale
    </Text>
  </Box>
);

export const CreateSaleWindow = () => {
  const isRescricted = useRescrictedCountries();
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");

  const { state } = useWindowManager();

  const fullScreenWindow = useMemo(() => {
    if (state.fullScreen === "swap") {
      return true;
    }

    return false;
  }, [state]);

  return (
    <Window
      id="swap"
      height={fullScreenWindow ? "100%" : isLargerThanMd ? "500px" : "80%"}
      width={fullScreenWindow ? "100%" : isLargerThanMd ? "655px" : "95%"}
      top={{
        base: fullScreenWindow ? "0" : "60%",
        sm: fullScreenWindow ? "0" : "58%",
        md: fullScreenWindow ? "0" : "56%"
      }}
      left={fullScreenWindow ? "0" : "50%"}
      transform={fullScreenWindow ? "translate(0, 0)" : "translate(-50%, -50%)"}
      fullScreenWindow={fullScreenWindow}
      defaultIsOpen
    >
      <Window.TitleBar />
      <Window.Content p={2}>
        {isRescricted ? (
          <RestrictedCountries />
        ) : (
          <>
            {!fullScreenWindow && <SwapWidgetTitle />}
            <Flex w={"full"} alignItems={"center"} direction={"column"}>
              {fullScreenWindow && <SwapWidgetTitle />}
              <Flex
                direction={"column"}
                alignItems={"start"}
                textAlign={"center"}
                w={"fit-content"}
                gap={2}
              ></Flex>
            </Flex>
          </>
        )}
        <Image
          src="/windows/alchemist/clouds.png"
          alt=""
          position="absolute"
          right="0"
          bottom="0"
          zIndex="-1"
          filter="blur(12px)"
        />
      </Window.Content>
    </Window>
  );
};
