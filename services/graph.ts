import { gql } from "@apollo/client";

export const getTokensOnSale = gql`
  query GetAllTokensOnSale {
    tokenOnSales {
      tokenID
      id
      price
      sale {
        batchID
        blockNumber
        ceilingPrice
        floorPrice
        id
      }
    }
  }
`;

export const getAllSalesWithTokens = gql`
  query GetAllSalesWithTokens {
    sales(orderBy: batchID) {
      batchID
      blockNumber
      ceilingPrice
      floorPrice
      ipfsHash
      id
      tokensOnSale(orderBy: tokenID) {
        id
        tokenID
        buyer
        metadata {
          name
          imageURI
          description
        }
      }
    }
  }
`;

export const getSaleById = gql`
  query GetSaleById($id: Bytes!) {
    sale(id: $id) {
      batchID
      blockNumber
      ceilingPrice
      floorPrice
      ipfsHash
      id
      tokensOnSale {
        id
        tokenID
        buyer
      }
    }
  }
`;

export const getTokenById = gql`
  query GetTokenOnSaleById($id: Bytes!) {
    tokenOnSale(id: $id) {
      batchID
      blockNumber
      buyer
      id
      price
    }
  }
`;

export const getTokensMetadataForASale = gql`
  query GetTokensMetadata($tokenIds: [String!]!) {
    tokens(where: { tokenId_in: $tokenIds }) {
      id
      tokenId
      metadata {
        name
        imageURI
        description
      }
    }
  }
`;

export const getTokensByOwner = gql`
  query GetTokensByOwner($owner: String!) {
    tokens(where: { owner: $owner }, orderBy: tokenId, orderDirection: asc) {
      owner
      tokenId
      tokenAddress
      uri
    }
  }
`;

export const getTokensOwners = gql`
  query GetTokensOwners($ids: [ID!]!) {
    tokens(where: { id_in: $ids }) {
      id
      owner
    }
  }
`;

export const getUserCopyBalance = gql`
  query GetUserCopyBalance($id: ID!) {
    userCopyBalance(id: $id) {
      balance
      id
      originalTokenId
      user
    }
  }
`;
