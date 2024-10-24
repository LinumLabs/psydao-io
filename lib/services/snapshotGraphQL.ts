import { gql } from 'graphql-request';
import { snapshotGraphQLClient } from './config/graphql';

export interface Proposal {
    start: number;
    end: number;
    id: string;
    snapshot: string;
}
export interface Vote {
    id: string;
    voter: string;
    created: number;
}

export const getProposals = gql`
    query Proposals($startTimeStamp: Int!, $endTimeStamp: Int!) {
        proposals (
            first: 1000,
            skip: 0,
            where: {
                space_in: ["psydao.eth"],
                state: "closed",
                created_gte: $startTimeStamp,
                created_lte: $endTimeStamp,
            },
            orderBy: "created",
            orderDirection: asc
        ) {
            id 
            start
            end
            snapshot  
        }
    }
`;

export const getVotesOnProposal = gql`
    query VotesForProposal($proposalId: String!) {
        votes(where: {proposal: $proposalId}) {
            id
            voter
            created
        }
    }
`;


export const getSnapshotProposals = async (startTimeStamp: number, endTimeStamp: number) => {
    try {
        const data = await snapshotGraphQLClient.request<{ proposals: Proposal[] }>(getProposals, {startTimeStamp, endTimeStamp});
        return data.proposals;
    } catch (err) {}
};

export const getVotesOnProposalById = async (proposalId: string) => {
    try {
    const data = await snapshotGraphQLClient.request<{votes:Vote[]}>(getVotesOnProposal, {proposalId});
    return data.votes;
    } catch (err) {}
};