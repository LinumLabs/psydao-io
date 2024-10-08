import type { Address } from "viem";

interface PoapResponseType {
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

const getPOAPStatus = async (address: Address | undefined) => {
  try {
    if (!address) return;
    const poapRes = await fetch(
      `http://localhost:3000/api/poap?address=${address}`,
      {
        method: "GET"
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonPoapResponse = await poapRes.json();

    if (!poapRes.ok) {
      console.error(`Failed to fetch POAP response: ${poapRes.statusText}`);
      return;
    }

    if (poapRes.status === 201) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return jsonPoapResponse as PoapResponseType;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching POAP response: ", errorMessage);
    throw error;
  }
};

export default getPOAPStatus;
