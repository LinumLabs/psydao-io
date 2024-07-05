import { useMemo } from "react";

import {
  Image,
  TabPanel,
  TabPanels,
  Tabs,
  useMediaQuery
} from "@chakra-ui/react";
import { Window } from "@/components/window";

import { useWindowManager } from "@/components/window-manager";
import MintPsycHeader from "./layout/nft-sale/mint-psyc-header";

import PsycSaleContent from "./layout/nft-sale/psyc-sale-content";
import OwnedNftsContent from "./layout/owned-nfts/owned-nfts-content";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { type GetAllTokensOnSaleData } from "@/lib/types";
import { getTokensOnSale } from "@/services/graph";

export const NftSaleWidget = () => {
  const { address } = useAccount();
  const { data } = useQuery<GetAllTokensOnSaleData>(getTokensOnSale);
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");

  const { state } = useWindowManager();

  const fullScreenWindow = useMemo(() => {
    if (state.fullScreen === "nft-sale") {
      return true;
    }

    return false;
  }, [state]);

  const tokensOnSale = data?.tokenOnSales?.length ?? 0;

  return (
    <Window
      id="nft-sale"
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
    >
      <Window.TitleBar />
      <Window.Content py={2} height={"100%"} width={"100%"}>
        <Tabs variant={"unstyled"}>
          <MintPsycHeader numberOfOwnedNfts={tokensOnSale} />
          <TabPanels>
            <TabPanel>
              <PsycSaleContent />
            </TabPanel>
            <TabPanel h="100%" w="100%">
              <OwnedNftsContent
                isFullScreen={fullScreenWindow}
                address={address}
                nftData={data}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
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
