import { env } from "@/config/env.mjs";
import { POAP_EVENT_ID } from "@/constants/shopifyWidget";
import { getAddressFromQuery } from "@/utils/getAddressFromQuery";
import type { NextApiRequest, NextApiResponse } from "next";

export interface PoapResponseType {
  event: {
    id: number;
    fancy_id: string;
    name: string;
    event_url: string;
    image_url: string;
    country: string;
    city: string;
    description: string;
    year: number;
    start_date: Date;
    end_date: Date;
    expiry_date: Date;
    tokenId: string;
    owner: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { address } = req.query as { address: string };
      const normalizedAddress = await getAddressFromQuery(address);

      const poapRes = await fetch(
        `https://api.poap.tech/actions/scan/${normalizedAddress}/${POAP_EVENT_ID}`,
        {
          headers: {
            accept: "application/json",
            "X-API-KEY": env.POAP_API_KEY
          },
          method: "GET"
        }
      );

      if (poapRes.status === 404) {
        res.status(204).end();
        return;
      }

      if (poapRes.status !== 404 && !poapRes.ok) {
        res.status(poapRes.status).send(poapRes.statusText);
        return;
      }

      res.status(200).send({ hasValidPoap: true });
      return;
    } catch (error: unknown) {
      console.error("Error getting POAP status:", error);
      if (error instanceof Error) {
        console.error("Error:", error.message);
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Unknown error occurred");
      }
    }
  } else {
    console.error("Method not allowed");
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
}
