import axios from "axios";
import { env } from "@/config/env.mjs";

export interface Balance {
  address: `0x${string}`;
  tokens: string;
}

export const uploadArrayToIpfs = async (array: Balance[]) => {
  try {
    const fileToUpload = new Blob([JSON.stringify(array)], {
      type: "application/json"
    });
    const formData = new FormData();
    formData.append("file", fileToUpload);
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${env.PINATA_JWT}`
        }
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error(error);
  }
};

export const getIpfsHash = async (ipfsHash: string) => {
  const response = await axios.get(
    `${env.NEXT_PUBLIC_PINATA_BASE_URL}/ipfs/${ipfsHash}`
  );
  return response.data;
};
