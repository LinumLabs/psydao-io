interface TokenOnSale {
  id: string;
  tokenID: string;
  owner: string;
  price: string;
}

interface Sale {
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

export interface GetAllTokensOnSaleData {
  tokenOnSales: TokenOnSale[];
}

export interface GetTokensByOwnerData {
  tokens: TokenOnSale[];
}

export interface TokenItem {
  src: string;
  price: string;
  isSold: boolean;
  batchId: string;
  tokenId: string;
}

export interface OwnedTokenItem {
  owner: string;
  tokenId: string;
  src: string;
}
