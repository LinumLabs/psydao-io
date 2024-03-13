import { EvmChain } from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis';

export const moralisSetup = async () => {
  const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
  if (!apiKey) {
    throw new Error('Moralis API key is not defined in environment variables');
  }
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey });
  }
};

export const getWalletTransactions = async (
  walletAddress: string,
) => {
  await moralisSetup();
  try {
    const walletTransactions =
      await Moralis.EvmApi.transaction.getWalletTransactions({
        address: walletAddress,
        chain: EvmChain.ETHEREUM,
        include: 'internal_transactions',
      });
    return walletTransactions;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getWalletTransactions Error: ', err);
    throw err;
  }
};