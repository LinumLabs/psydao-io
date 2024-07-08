import { Grid } from "@chakra-ui/react";
import { PsycItemBase } from "../../psyc-item";
import { type GetTokensByOwnerData } from "@/lib/types";

import { useAccount } from "wagmi";

type OwnedNftsProps = {
  nftData: GetTokensByOwnerData | undefined;
};

const OwnedNfts = (props: OwnedNftsProps) => {
  const images = ["/psyc1.png", "/psyc2.png", "/psyc3.png", "/psyc4.png"];
  const { address } = useAccount();

  // TODO: Add check to see if sale is private and re-add price and mint button if public
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(auto-fit, minmax(170px, 1fr))"
      }}
      gap={6}
    >
      {props.nftData?.tokens.map((token, index) => {
        return (
          <PsycItemBase
            key={index}
            item={{
              src: images[index % images.length] ?? "",
              owner: token.owner,
              tokenId: token.tokenID
            }}
            // TODO: Add util to get number of copies
            copiesOwned={5}
            src={images[index % images.length] ?? ""}
            index={index}
            // TODO: Add public and private sale checks
            isPrivateSale={false}
            isOwned={token.owner === address}
          />
        );
      })}
    </Grid>
  );
};

export default OwnedNfts;
