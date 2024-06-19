import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
  useMemo
} from "react";
import { useAccount, useBalance } from "wagmi";
import { formatUnits, parseEther } from "viem";
import ImageNext from "next/image";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Link, Text, useMediaQuery } from "@chakra-ui/react";
import { Window } from "@/components/window";
import { TokenContainer } from "@/components/token-container";
import { ConnectWalletButton } from "@/components/connect-button";
import { useRescrictedCountries } from "hooks/restrictedCountries";
import { RestrictedCountries } from "@/components/swap-widget/RestrictedCountries";
import { SwapTsAndCs } from "@/components/swap-widget/SwapTsAndCs";
import { psyDAOTokenPrice } from "@/constants/psyTokenPrice";
import { useReadEthPrice } from "@/services/web3/useReadEthPrice";
import { useReadTokenPriceInDollar } from "@/services/web3/useReadTokenPriceInDollar";
import { useReadTotalTokensForSale } from "@/services/web3/useReadTotalTokensForSale";
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
      PSY token sale now open
    </Text>
    <Link
      textDecoration={"underline"}
      textColor="#269200"
      fontWeight="400"
      fontSize={{ base: "18px", md: "24px" }}
      lineHeight={{ base: "18px", md: "24px" }}
      textUnderlineOffset={"12px"}
      fontFamily={"Amiri"}
      href="/documents/psydao-whitepaper.pdf"
      target="_blank"
      rel="noreferrer noopener"
    >
      Whitepaper
    </Link>
  </Box>
);

export const SwapWidget = () => {
  const isRescricted = useRescrictedCountries();
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");

  const { state } = useWindowManager();

  const [focused, setFocused] = useState<string>("");

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
