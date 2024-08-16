import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
// CHAINALYSIS_API_KEY="b07b7712df94f583317beaa8751abcbdaed7f77e507c4e18b2be1ea75569b347"
// NEXT_PUBLIC_APP_NAME="PsyDao"
// NEXT_PUBLIC_CHAIN_ID="11155111"
// # NEXT_PUBLIC_CHAIN_ID="1"
// NEXT_PUBLIC_MIXPANEL_ID="b9002a4ca261f5fcd09f1a6f4bc80334"
// NEXT_PUBLIC_PROJECT_ID="c67216fadf4d10191cfda6dc8a733d0d"
// NX_DAEMON=""
// NEXT_PUBLIC_SUBGRAPH_URL="https://api.studio.thegraph.com/query/83978/psydao-sepolia/version/latest"
// # NEXT_PUBLIC_SUBGRAPH_URL="https://api.studio.thegraph.com/query/83978/psydao-mainnet/version/latest"
// PINATA_API_KEY="f036aac63f1ab7a8da93"
// PINATA_SECRET_API_KEY="fb260f7a41a52fc7acbd9edcaaf24120896520b2d41240447678467ba9ec7a34"
// PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhY2ZhMmM1ZS1hOTQxLTRlNGItOTIyOS02MGRmMjgwOTM3N2EiLCJlbWFpbCI6ImRvbndhbGV5YkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTMyOTRlNTc2OTdhNWU2OGIyYzAiLCJzY29wZWRLZXlTZWNyZXQiOiJlNmQ0ZmViODU1MmI5ZDBkMTlmMmRhYjgyZjQ0ZDIxMWQ0OWNhOWZhODMwYmM2ODFiMzZiYmNlN2EwNDg2Y2ZhIiwiaWF0IjoxNzE4NTAwNTY5fQ.lS1-AKCrxsrDxrcdIxgXARwRGnkxwDFBriFTchQ7d1Y"
// NEXT_PUBLIC_PINATA_BASE_URL="https://red-literary-tiglon-645.mypinata.cloud/ipfs"
// NEXT_PUBLIC_SEPOLIA_ETHERSCAN_BASE_URL="https://sepolia.etherscan.io/nft/0x64e78537782095a38e3785431be3647856980ffa"
// NEXT_PUBLIC_MAINNET_ETHERSCAN_BASE_URL="https://etherscan.io/nft/0x6c6Ab7b3215374dE4A65De63eAC9BC7A0c7f402d"
export const env = createEnv({
  server: {
    CHAINALYSIS_API_KEY: z.string(),
    PINATA_API_KEY: z.string(),
    PINATA_SECRET_API_KEY: z.string(),
    PINATA_JWT: z.string()
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string(),
    NEXT_PUBLIC_CHAIN_ID: z.string(),
    NEXT_PUBLIC_MIXPANEL_ID: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_SUBGRAPH_URL: z.string(),
    NEXT_PUBLIC_PINATA_BASE_URL: z.string(),
    NEXT_PUBLIC_SEPOLIA_ETHERSCAN_BASE_URL: z.string(),
    NEXT_PUBLIC_MAINNET_ETHERSCAN_BASE_URL: z.string()
  },
  runtimeEnv: {
    CHAINALYSIS_API_KEY: process.env.CHAINALYSIS_API_KEY
  }
});
