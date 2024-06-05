import graphClient from "@/config/graphql";
import { gql } from "@apollo/client";

const getNFTs = gql`
  query getNfts {
    nfts(first: 5) {
      metadata {
        image
        name
        id
      }
    }
  }
`;

export default getNFTs;
