import { createPublicClient, http } from "viem";
import { mainnet } from "wagmi/chains";

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://eth-mainnet.g.alchemy.com/v2/yb_t_jZK-Ql8bD1WYT-v_6Lzn0btd3xh"
  )
});
