import { useReadContract } from "wagmi";
import chainLinkAbi from "../../abis/chainLinkAbi.json";

export const useReadEthPrice = () => {
  const { data, isPending, error }: any = useReadContract({
    abi: chainLinkAbi,
    // address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // mainnet
    address: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // sepolia
    functionName: "latestRoundData",
  });

  return {
    data: data && Number(data[1]),
    isPending,
    error,
  };
};
