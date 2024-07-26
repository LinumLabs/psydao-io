import { useEffect, useMemo, useState } from "react";
import {
  Image,
  useMediaQuery,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import { Window } from "@/components/ui/window";
import { useWindowManager } from "@/components/ui/window-manager";
import MintPsycHeader from "./layout/nft-sale/mint-psyc-header";
import PsycSaleContent from "./layout/nft-sale/psyc-sale-content";
import OwnedNftsContent from "./layout/owned-nfts/owned-nfts-section";
import { TokenProvider } from "@/providers/TokenContext";
import type {
  Sale,
  GetSaleByIdData,
  GetAllSalesWithTokensData
} from "@/lib/types";
import { useQuery } from "@apollo/client";
import { getAllSalesWithTokens, getSaleById } from "@/services/graph";
import { InterimState } from "../commons/interim-state";
import { useGetWhitelistedSales } from "@/utils/getWhitelistedSales";

export const NftSaleWidget = ({ updateTrigger }: { updateTrigger: number }) => {
  const [selectedSale, setSelectedSale] = useState<Sale>();
  const [isOriginal, setIsOriginal] = useState<boolean>(true);
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");
  const {
    data: saleById,
    loading: loadingSaleById,
    error: errorSaleById,
    refetch: refetchSaleById
  } = useQuery<GetSaleByIdData>(getSaleById, {
    variables: { id: selectedSale ? selectedSale.id : "1" }
  });

  const {
    data: allSales,
    loading: loadingAllSales,
    refetch: refetchAllSales
  } = useQuery<GetAllSalesWithTokensData>(getAllSalesWithTokens);

  const [whitelistedSales, setWhitelistedSales] = useState<Sale[] | undefined>(
    undefined
  );

  const { handleGetWhitelistedSales } = useGetWhitelistedSales(allSales?.sales);

  useEffect(() => {
    const getWhitelistedSales = async () => {
      const sales = await handleGetWhitelistedSales();
      console.log(sales, "whitelistedSales");
      if (sales) {
        setWhitelistedSales(sales);
      }
    };

    console.log("executing");

    getWhitelistedSales().catch((error) => {
      console.error("Error getting whitelisted sales:", error);
    });
  }, [setWhitelistedSales]);

  useEffect(() => {
    if (saleById) {
      setSelectedSale(saleById.sale);
    }
  }, [saleById]);

  useEffect(() => {
    const refetchData = async () => {
      await refetchSaleById();
      await refetchAllSales();
      console.log("Refetched data");
    };
    refetchData().catch(console.error);
  }, [updateTrigger, refetchSaleById, refetchAllSales]);

  const { state } = useWindowManager();

  const fullScreenWindow = useMemo(() => {
    return state.fullScreen === "nft-sale";
  }, [state]);

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
      <Window.Content py={2} px={0} height={"100%"} width={"100%"}>
        <TokenProvider>
          <Tabs variant={"unstyled"}>
            <MintPsycHeader
              selectedSale={selectedSale}
              setselectedSale={setSelectedSale}
              isOriginal={isOriginal}
              setIsOriginal={setIsOriginal}
              whitelistedSales={whitelistedSales}
            />
            {loadingSaleById ? (
              <InterimState type="loading" />
            ) : errorSaleById ? (
              <InterimState type="error" />
            ) : (
              <TabPanels>
                <TabPanel px={0}>
                  <PsycSaleContent
                    isFullScreen={fullScreenWindow}
                    selectedSale={selectedSale}
                    isOriginal={isOriginal}
                  />
                </TabPanel>
                <TabPanel h="100%" w="100%">
                  <OwnedNftsContent isFullScreen={fullScreenWindow} />
                </TabPanel>
              </TabPanels>
            )}
          </Tabs>
        </TokenProvider>
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
