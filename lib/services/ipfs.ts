import axios from "axios";
import { PinataMetadata, PinataSDK } from "pinata-web3";
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

export async function pinListToIpfs(merkleList: Balance[]) {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_ADMIN_JWT!,
      // @Bevan for me it only works with the prefix - please check :( otherwise all looks good!
      pinataGateway: "red-literary-tiglon-645.mypinata.cloud"
    });

    const options = {
      pinataOptions: {
        cidVersion: 0,
        customPinPolicy: {
          regions: [{ id: "FRA1", desiredReplicationCount: 1 }]
        }
      },
      pinataMetadata: {
        name: `PsyDAO Merkle Tree Data ${new Date().toISOString()}`,
        keyvalues: {
          type: "merkle-tree-data"
        }
      },
      groupId: "fa33eb74-0699-443c-8f1b-a8bf15c74360" // PsyDao's groupId
    };

    const upload = await pinata.upload.json(merkleList, options);

    const ipfsHash = upload.IpfsHash;

    return ipfsHash;
  } catch (error) {
    console.error(error);
  }
}
