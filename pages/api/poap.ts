import { env } from "@/config/env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, getAddress, http, isAddress, type Address } from "viem";
import { mainnet } from 'viem/chains';

const POAP_EVENT_ID = env.POAP_EVENT_ID;

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

/**
 * Validates and normalizes an Ethereum address from a query string.
 * 
 * @param address - The address or ENS name to validate and normalize.
 * @returns A Promise that resolves to the normalized Ethereum address (type Address)..
 * @throws {Error} If the address is not a valid Ethereum address or ENS name.
 */
async function getAddressFromQuery(address: string): Promise<Address> {
  if (isAddress(address)) {
    return getAddress(address);
  }

  // check if its an ENS name
  const resolvedAddress: Address | null = await publicClient.getEnsAddress({ name: address });
  if (resolvedAddress) {
    return resolvedAddress;
  }

  throw new Error("Invalid ethereum address");
}

/**
 * Fetches POAP event data for a given event ID.
 * 
 * @param eventId - The ID of the POAP event to fetch.
 * @returns A Promise that resolves to the POAP event data.
 * @throws {Error} If the API request fails or returns a non-OK status.
 */
async function getPoapEvent(eventId: string) {
  const poapRes = await fetch(
    `https://api.poap.tech/events/id/${eventId}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.POAP_API_KEY
      },
      method: "GET"
    }
  );

  if (!poapRes.ok) {
    console.error('Failed to fetch POAP event', poapRes.status, poapRes.statusText);
    throw new Error("Failed to fetch POAP event");
  }

  const eventData = await poapRes.json() as unknown as Record<string, PropertyKey>;
  return eventData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { address } = req.query as { address: string };
      const normalizedAddress = await getAddressFromQuery(address);
      const poapEvent = await getPoapEvent(POAP_EVENT_ID);

      console.log("data: ", {
        address,
        POAP_EVENT_ID,
        POAP_API_KEY: env.POAP_API_KEY,
        normalizedAddress,
        poapEvent
      });
      // TODO: Get type for POAP response body
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
      if (!poapRes.ok) {
        res.status(poapRes.status).send(poapRes.statusText);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonPoapResponse = await poapRes.json();
      console.log(jsonPoapResponse);
      res.status(200).send(jsonPoapResponse);
    } catch (error: unknown) {
      console.error("Error getting POAP status:", error);
      if (error instanceof Error) {
        console.log("Error:", error.message);
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Unknown error occurred");
      }
    }
  } else {
    console.log("Method not allowed");
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
