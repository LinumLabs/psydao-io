import { Flex, Text, Image } from "@chakra-ui/react";
import SubmitButtonContainer from "./submit-button-container";
import PsyButton from "../ui/psy-button";
import { useChainModal } from "@rainbow-me/rainbowkit";

const WrongNetworkWindow = () => {
  const { openChainModal } = useChainModal();
  const CHAINID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 1;
  return (
    <Flex p={2} pb={5} direction={"column"} gap={4}>
      <Text
        textColor="#269200"
        fontWeight="500"
        fontStyle="italic"
        mt="1"
        fontSize={{ base: "20px", sm: "36px" }}
        fontFamily={"Amiri"}
      >
        Wrong network!
      </Text>
      <Text
        textColor="#269200"
        fontWeight="500"
        fontStyle="italic"
        mt="1"
        fontSize={{ base: "14px", sm: "24px" }}
        fontFamily={"Amiri"}
      >
        {CHAINID === 1
          ? "Please switch to Ethereum mainnet"
          : "Please switch to Sepolia testnet"}
      </Text>
      <Image
        src="/windows/swap/restricted-countries.png"
        alt="Wrong network background"
      />

      <SubmitButtonContainer>
        <PsyButton
          customStyle={{ width: "100%", maxWidth: "550px" }}
          onClick={() => {
            openChainModal && openChainModal();
          }}
        >
          {CHAINID === 1
            ? "Switch to Ethereum Mainnet"
            : "Switch to Sepolia Testnet"}
        </PsyButton>
      </SubmitButtonContainer>
    </Flex>
  );
};

export default WrongNetworkWindow;
