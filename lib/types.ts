import type { Address } from "viem";

interface Metadata {
  id: string;
  description: string;
  imageURI: string;
}
export interface TokenOnSale {
  id: string;
  tokenID: string;
  buyer: Address | null;
  metadata: Metadata;
}

export interface Sale {
  ipfsHash: string;
  batchID: string;
  blockNumber: string;
  ceilingPrice: string;
  floorPrice: string;
  id: string;
  tokensOnSale: TokenOnSale[];
}

export interface GetAllSalesWithTokensData {
  sales: Sale[];
}

export interface GetSaleByIdData {
  sale: Sale;
}

export interface TokenItem {
  src: string;
  price: string;
  isSold: boolean;
  batchId: string;
  tokenId: string;
  ipfsHash: string;
}

export type OwnedTokenItem = {
  owner: string;
  tokenAddress: string;
  tokenId: string;
  uri: string;
  __typename: string;
};

export type GetTokensByOwnerData = {
  tokens: OwnedTokenItem[];
};

export type AdminSale = {
  ceilingPrice: string;
  floorPrice: string;
  startDate: string;
  startTime: string;
  tokenIds: number[];
};

export type GeneralSettings = {
  revenue: string;
  buyLimit: string;
  royalties: string;
  treasury: string;
  ownerPercentage: string;
  openPublicSale: boolean;
};
