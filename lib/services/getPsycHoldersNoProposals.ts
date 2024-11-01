import { getPsycHoldersByTimestamps } from "./getPsycHolders";
import { keccak256, encodePacked, parseUnits, Address } from "viem";
import { MerkleTree } from "merkletreejs";
import { Balance, uploadArrayToIpfs } from "./ipfs";
import { userTestMapping } from "./config/test-mapping";
import { TEST_ENV } from "@/constants/claims";

export const psycHoldersNoProposals = async (
  startTimeStamp: number,
  endTimeStamp: number,
  totalAmountOfTokens: number,
  batchId: number
) => {
  let balances: Balance[] = [];
  const sgData = await getPsycHoldersByTimestamps(startTimeStamp, endTimeStamp);

  const psycHolders = sgData.map((psycHolder) =>
    TEST_ENV
      ? (userTestMapping[psycHolder.owner] ?? psycHolder.owner.toLowerCase() as Address)
      : psycHolder.owner.toLowerCase() as Address
  );
  const tokenPerHolder = totalAmountOfTokens / psycHolders.length;

  // Calculate the amount of tokens each psyc holder gets based on the percentage of votes they have
  balances = psycHolders.map((psycHolder) => {
    return {
      address: psycHolder as Address,
      tokens: tokenPerHolder.toString()
    };
  });

  const leaves = balances.map((holder) =>
    keccak256(
      encodePacked(
        ["uint256", "uint256", "address"],
        [
          BigInt(batchId),
          parseUnits(holder.tokens, 18),
          holder.address as Address
        ]
      )
    )
  );

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = tree.getHexRoot();

  const ipfsHash = await uploadArrayToIpfs(balances);

  return { balances, merkleRoot, ipfsHash };
};
