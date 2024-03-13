import { getWalletTransactions } from "clients/moralis";

export const checkWalletBlacklist = async (walletAddress: string) => {
    const walletTransactions = await getWalletTransactions(walletAddress);

    // Update list with blacklisted addresses
    const blacklistedAddresses = ["ADDRESS1", "ADDRESS2", "ADDRESS3"];
    
    const hasBlacklistedTransaction = walletTransactions?.raw?.result.some(transaction =>
      blacklistedAddresses.includes(transaction.from_address) ||
      blacklistedAddresses.includes(transaction.to_address)
    );
    
    return hasBlacklistedTransaction;
  };
  