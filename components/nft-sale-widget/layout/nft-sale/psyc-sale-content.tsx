import { Divider } from "@chakra-ui/react";
import MintRandomPsycHeader from "./mint-random-psyc-header";
import MintSection from "./mint-section";
import MintSpecificPsycHeader from "./mint-specific-psyc-header";
import type { Sale } from "@/lib/types";

type PsycSaleContentProps = {
  isFullScreen: boolean;
  selectedSale: Sale | undefined;
  isOriginal: boolean;
};

const PsycSaleContent = ({
  isFullScreen,
  selectedSale,
  isOriginal
}: PsycSaleContentProps) => {
  return (
    <>
      <MintRandomPsycHeader isFullScreen={isFullScreen} />
      <MintSection
        isRandom={true}
        selectedSale={selectedSale}
        isOriginal={isOriginal}
      />
      <Divider
        h={"1px"}
        border={"none"}
        bg={"#E9BDBD"}
        width={"100%"}
        display={{ base: "none", sm: "block" }}
      />
      <MintSpecificPsycHeader isFullScreen={isFullScreen} />
      <MintSection
        isRandom={false}
        selectedSale={selectedSale}
        isOriginal={isOriginal}
      />
    </>
  );
};

export default PsycSaleContent;
