import psycSaleAbiSepolia from "../abis/psycSaleAbiSepolia.json";
import psyNFTAbiSepolia from "../abis/psyNFTAbiSepolia.json";
import { psycSaleSepolia, psyNFTSepolia } from "../constants/contracts";
import { type AbiItem } from "web3-utils";

const psycSaleContractConfig = {
  address: psycSaleSepolia as `0x${string}`,
  abi: psycSaleAbiSepolia as AbiItem[]
};

const psyNftContractConfig = {
  address: psyNFTSepolia as `0x${string}`,
  abi: psyNFTAbiSepolia as AbiItem[]
};

export { psycSaleContractConfig, psyNftContractConfig };
