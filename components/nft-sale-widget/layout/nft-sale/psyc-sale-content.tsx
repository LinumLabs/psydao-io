import { Divider } from "@chakra-ui/react";
import MintRandomPsycHeader from "./mint-random-psyc-header";
import MintSection from "./mint-section";
import MintSpecificPsycHeader from "./mint-specific-psyc-header";
import type { Sale } from "@/lib/types";

type PsycSaleContentProps = {
  isFullScreen: boolean;
  selectedSale: Sale | undefined;
};

const PsycSaleContent = (props: PsycSaleContentProps) => {
  return (
    <>
      <MintRandomPsycHeader isFullScreen={props.isFullScreen} />
      <MintSection isRandom selectedSale={props.selectedSale} />
      <Divider
        h={"1px"}
        border={"none"}
        bg={"#E9BDBD"}
        width={"100%"}
        display={{ base: "none", sm: "block" }}
      />
      <MintSpecificPsycHeader isFullScreen={props.isFullScreen} />
      <MintSection isRandom={false} selectedSale={props.selectedSale} />
    </>
  );
};

export default PsycSaleContent;
