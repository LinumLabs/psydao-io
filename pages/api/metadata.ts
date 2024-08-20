import { NextApiRequest, NextApiResponse } from 'next';
import { PinataSDK } from 'pinata';

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GROUP_ID = "fa33eb74-0699-443c-8f1b-a8bf15c74360"
const PINATA_GATEWAY = "red-literary-tiglon-645.mypinata.cloud"
const PINATA_CID = "QmVpsuNPY3JVYC7YkttDjX1NXEA5tmj9cJfxqGYBQvi71J"

const PINATA_ADMIN_JWT = process.env.PINATA_ADMIN_JWT;



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const pinata = new PinataSDK({
      pinataJwt: PINATA_ADMIN_JWT!,
      pinataGateway: PINATA_GATEWAY,
    });

    const files = await pinata
      .listFiles()
      .cid(PINATA_CID)

    if (files.length === 1) {
      const folder = files[0]
      if (folder?.mime_type === 'directory') {
        console.log('found directory!')
      }
    }

    console.log('Files -> ', files)

    const foundDirectory = await pinata.gateways.get(PINATA_CID)

    console.log('foundDirectory -> ', foundDirectory)

    return res.status(200).json({ files, foundDirectory });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
