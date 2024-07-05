import { Grid } from "@chakra-ui/react";
import OwnedNftsEmptyState from "./owned-nfts-empty-state";
import { useQuery } from "@apollo/client";
import { getTokensByOwner } from "@/services/graph";
import { type GetTokensByOwnerData } from "@/lib/types";

type OwnedNftsContentProps = {
  isFullScreen: boolean;
  address: `0x${string}` | undefined;
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
      {!loading && ownedNfts && ownedNfts.tokens.length > 0 ? (
        <></>
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
