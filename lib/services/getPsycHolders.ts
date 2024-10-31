import { getNFTHolders } from "@/services/graph";
import { psycGraphQLClient, psycMainnetGraphQLClient } from "../../config/graphqlClients";
import { Address } from "viem";

export interface PsycHolder {
  owner: Address;
}

/**
 * Get the owners of the Psyc NFTs on the mainnet
 * 
 * @param blockNumber - The block number to query
 * @returns An array of PsycHolder objects
 */
export const getPsycHolders = async (blockNumber: number) => {
  try {
    const data = await psycMainnetGraphQLClient.request<{ tokens: PsycHolder[] }>(
      getNFTHolders,
      { blockNumber }
    );
    return data.tokens;
  } catch (err) {
    console.error("Error fetching Psyc holders:", err);
    throw err;
  }
};
