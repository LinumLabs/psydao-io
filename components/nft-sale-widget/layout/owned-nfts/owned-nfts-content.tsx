import { Grid } from "@chakra-ui/react";
import OwnedNftsEmptyState from "./owned-nfts-empty-state";

import {
  type GetTokensByOwnerData,
  type GetAllTokensOnSaleData
} from "@/lib/types";
import OwnedNfts from "./owned-nfts";
import { useQuery } from "@apollo/client";
import { getTokensByOwner } from "@/services/graph";

type OwnedNftsContentProps = {
  isFullScreen: boolean;
  address: `0x${string}` | undefined;
  nftData: GetAllTokensOnSaleData | undefined;
};

const OwnedNftsContent = (props: OwnedNftsContentProps) => {
  const { data: ownedNfts, loading } = useQuery<GetTokensByOwnerData>(
    getTokensByOwner,
    {
      variables: {
        owner: props.address ?? ""
      }
    }
  );

  return (
    <>
      {!loading && ownedNfts ? (
        <OwnedNfts nftData={props.nftData} />
      ) : (
        <Grid
          minH={"100%"}
          h={"100%"}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          gridTemplateRows={{
            base: "30% 100%",
            md: props.isFullScreen ? "75% 100%" : "15% 100%"
          }}
        >
          <OwnedNftsEmptyState />
        </Grid>
      )}
    </>
  );
};

export default OwnedNftsContent;
