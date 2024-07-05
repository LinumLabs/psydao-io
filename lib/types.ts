interface TokenOnSale {
  id: string;
  tokenID: string;
  owner: string;
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
