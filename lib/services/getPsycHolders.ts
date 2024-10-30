import { getNFTHolders } from "@/services/graph";
import { psycGraphQLClient } from "../../config/graphqlClients";
import { Address } from "viem";

export interface PsycHolder {
  owner: Address;
}

export const getPsycHolders = async (blockNumber: number) => {
  try {
    const data = await psycGraphQLClient.request<{ tokens: PsycHolder[] }>(
      getNFTHolders,
      { blockNumber }
    );
    return data.tokens;
  } catch (err) {
    console.error("Error fetching Psyc holders:", err);
    throw err;
  }
};
