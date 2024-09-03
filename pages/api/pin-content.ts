import { env } from "@/config/env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { PinataSDK } from "pinata";
import { pinContentSchema } from "./schema";

const pinata = new PinataSDK({
  pinataJwt: env.PINATA_JWT,
  pinataGateway: env.NEXT_PUBLIC_PINATA_BASE_URL
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const ipfsHash = pinContentSchema.safeParse(req.body);

      if (ipfsHash?.data?.ipfsHash) {
        await pinata.upload.cid(ipfsHash.data.ipfsHash);
      }
      res.status(200).send("Content pinned successfully");
    } catch (error: unknown) {
      console.error("Error pinning content:", error);
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Unknown error occurred");
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
