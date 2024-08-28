interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

const pinAddresses = async (ipfsHash: string) => {
  try {
    const pinataRes = await fetch("/api/pin-content", {
      method: "POST",
      body: JSON.stringify({ ipfsHash })
    });

    if (!pinataRes.ok) {
      throw new Error(`Failed to fetch JWT: ${pinataRes.statusText}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error pinning addresses: ", errorMessage);
    throw error;
  }
};

export const uploadAddresses = async (addresses: string[]): Promise<string> => {
  try {
    const jwtRes = await fetch("/api/generate-jwt", { method: "POST" });

    if (!jwtRes.ok) {
      throw new Error(`Failed to fetch JWT: ${jwtRes.statusText}`);
    }

    const JWT = await jwtRes.text();

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ addresses })
    });

    if (!res.ok) {
      throw new Error(`Failed to upload addresses: ${res.statusText}`);
    }
    const json: PinataResponse = (await res.json()) as PinataResponse;

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (json && json.IpfsHash) {
      await pinAddresses(json.IpfsHash);
    }

    return json.IpfsHash;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error uploading addresses:", message);
    throw new Error(message);
  }
};
