import { MerkleTree } from "merkletreejs";
import { useUpdateMerkleRoot } from "./web3/useUpdateMerkleRoot";
import { keccak256 } from "ethers";

// TODO: create file for getting/uploading IPFS

const addresses: `0x${string}`[] = [
  "0x8754a4c886f8Cb77a1d2F38470c653DDb4727f21"
];

const getMerkleRoot = (values: `0x${string}`[]) => {
  const leaves = values.map((item) => keccak256(item));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  return merkleTree.getRoot();
};

export const getMerkleProof = (
  address: `0x${string}` | null | undefined,
  whitelist?: `0x${string}`[]
): string[] => {
  if (!whitelist || !address) {
    console.error("Invalid whitelist or address:", { whitelist, address });
    return [];
  }
  try {
    const leaves = whitelist.map((item) => keccak256(item));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const proof = merkleTree.getHexProof(keccak256(address));
    return proof;
  } catch (error) {
    console.error("Error generating Merkle proof:", error);
    return [];
  }
};

export const updateMerkleTree = async (batchId: number, ipfsHash: string) => {
  const merkleRoot = getMerkleRoot(addresses);
  const { updateMerkleRoot, error: merkleError } = useUpdateMerkleRoot();
  // contract call:
  try {
    await updateMerkleRoot(batchId, merkleRoot, ipfsHash);
  } catch (error) {
    console.error(merkleError);
  }
};
