// hooks/usePinataFolderContents.ts

import { useState, useEffect } from 'react';

interface PinataFile {
  name: string;
  ipfs_pin_hash: string;
}

interface PinataResponse {
  rows: Array<{
    metadata: {
      name: string;
    };
    ipfs_pin_hash: string;
  }>;
}

function isPinataResponse(data: unknown): data is PinataResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'rows' in data &&
    Array.isArray((data as PinataResponse).rows) &&
    (data as PinataResponse).rows.every(row =>
      typeof row === 'object' &&
      row !== null &&
      'metadata' in row &&
      typeof row.metadata === 'object' &&
      row.metadata !== null &&
      'name' in row.metadata &&
      typeof row.metadata.name === 'string' &&
      'ipfs_pin_hash' in row &&
      typeof row.ipfs_pin_hash === 'string'
    )
  );
}

export const usePinataFolderContents = (folderCID: string | null) => {
  const [folderContents, setFolderContents] = useState<PinataFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (folderCID) {

      fetchFolderContents(folderCID)
        .then(() => {
          // Handle successful completion if needed
        })
        .catch((error) => {
          console.error("Error fetching folder contents:", error);
        });
    }
  }, [folderCID]);

  const fetchFolderContents = async (cid: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, get a temporary JWT
      const jwtResponse = await fetch('/api/generate-jwt', { method: 'POST' });
      if (!jwtResponse.ok) {
        throw new Error('Failed to generate JWT');
      }
      const jwt = await jwtResponse.text();

      // Now use this JWT to fetch the folder contents
      const response = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${cid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch folder contents');
      }

      const data: unknown = await response.json();

      if (!isPinataResponse(data)) {
        throw new Error('Unexpected response structure from Pinata API');
      }

      const files = data.rows
        .map((pin) => ({
          name: pin.metadata.name,
          ipfs_pin_hash: pin.ipfs_pin_hash
        }))
        .sort((a, b) => Number(a.name) - Number(b.name));

      setFolderContents(files);
    } catch (err) {
      console.error("Error fetching folder contents:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { folderContents, isLoading, error };
};