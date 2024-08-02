import { gql } from "@apollo/client";

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
          id
          description
          imageURI
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
        metadata {
          id
          description
          imageURI
        }
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

export const getTokensByOwner = gql`
  query GetTokensByOwner($owner: String!) {
    tokens(where: { owner: $owner }) {
      owner
      tokenId
      tokenAddress
      metadata {
        id
        description
        imageURI
      }
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
