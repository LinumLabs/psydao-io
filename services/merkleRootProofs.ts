import { keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

const addresses: `0x${string}`[] = [
  "0x8754a4c886f8Cb77a1d2F38470c653DDb4727f21"
];

export const getMerkleRoot = (values: `0x${string}`[]) => {
  const leaves = values.map((item) => keccak256(item));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  return merkleTree.getRoot();
};

export const getMerkleProof = (
  address: `0x${string}` | null | undefined,
  whitelist?: `0x${string}`[]
) => {
  if (!whitelist || !address) return [];

  const leaves = whitelist.map((item) => keccak256(item));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const proof = merkleTree.getHexProof(keccak256(address));

  return proof;
};
const merkleRoot = getMerkleRoot(addresses);
// contract call:
// await setMerkleRoot(merkleRoot);
