import { Grid } from "@chakra-ui/react";
import PsycItem from "../../psyc-item";
import {
  GetAllTokensOnSaleData,
  type GetAllSalesWithTokensData
} from "@/lib/types";
import { formatUnits } from "viem";

type OwnedNftsProps = {
  nftData: GetAllTokensOnSaleData | undefined;
};

const OwnedNfts = (props: OwnedNftsProps) => {
  const images = ["/psyc1.png", "/psyc2.png", "/psyc3.png", "/psyc4.png"];

  // TODO: Add check to see if sale is private and re-add price and mint button if public
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(auto-fit, minmax(170px, 1fr))"
      }}
      gap={6}
    >
      {/* {props.nftData?.sales.map((sale, saleIndex) => {
        const tokenIdsForActivation = sale.tokensOnSale.map((token) =>
          parseInt(token.tokenID)
        );
        return sale.tokensOnSale.map((token) => (
          <PsycItem
            isPrivateSale={false}
            key={token.id}
            item={{
              src: images[saleIndex % images.length] ?? "",
              price: `${formatUnits(BigInt(sale.ceilingPrice), 18)} ETH`,
              isSold: false,
              batchId: sale.batchID,
              tokenId: token.tokenID
            }}
            index={parseInt(token.id, 10)}
            isRandom={false}
            tokenIdsForActivation={tokenIdsForActivation}
            isOwned
          />
        )); 
      })} */}
      {props.nftData?.tokenOnSales.map((token, index) => {
        const tokenIdsForActivation = props.nftData?.tokenOnSales.map((token) =>
          parseInt(token.tokenID)
        );
        return (
          <PsycItem
            key={index}
            item={{
              src: images[index % images.length] ?? "",
              price: `${formatUnits(BigInt(token.price), 18)} ETH`,
              isSold: false,
              batchId: token.id,
              tokenId: token.tokenID
            }}
            index={index}
            isRandom={false}
            isPrivateSale
            tokenIdsForActivation={tokenIdsForActivation ?? []}
            isOwned
          />
        );
      })}
    </Grid>
  );
};

export default OwnedNfts;
