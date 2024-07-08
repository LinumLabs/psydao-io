import { Grid } from "@chakra-ui/react";
import OwnedNftsEmptyState from "./owned-nfts-empty-state";

import { type GetTokensByOwnerData } from "@/lib/types";
import OwnedNfts from "./owned-nfts";
import { type ApolloError } from "@apollo/client";

type OwnedNftsContentProps = {
  isFullScreen: boolean;
  address: `0x${string}` | undefined;
  nftData: GetTokensByOwnerData | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

const OwnedNftsContent = (props: OwnedNftsContentProps) => {
  return (
    <>
      {!props.loading && !props.error && props.nftData ? (
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
