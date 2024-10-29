import { psycGraphQLClient } from "./config/graphql";
import { getNFTHolders } from "@/services/graph";

export interface PsycHolder {
  owner: string;
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
