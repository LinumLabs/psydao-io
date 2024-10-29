import { gql } from 'graphql-request';
import { psycGraphQLClient } from './config/graphql';

export interface PsycHolder {
    owner: string;
}

export const getNFTHolders = gql`
    query NFTHolders($blockNumber: Int!) {
    tokens(where: {tokenAddress: "0x6c6ab7b3215374de4a65de63eac9bc7a0c7f402d",blockNumber_lte: $blockNumber},orderBy: tokenId, orderDirection: asc)  {
        owner
    }
}
`;

export const getPsycHolders = async (blockNumber: number) => {
    try {
        const data = await psycGraphQLClient.request<{ tokens: PsycHolder[] } >(getNFTHolders, { blockNumber });
        return data.tokens;
    } catch (err) {
        console.error('Error fetching Psyc holders:', err);
        throw err;
    }
};
