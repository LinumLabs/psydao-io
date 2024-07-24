import { getAddresses } from "@/lib/server-utils";
import type { Sale } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useGetWhitelistedSales = (sales: Sale[] | undefined) => {
  const { address } = useAccount();
  const [allSales, setAllSales] = useState<Sale[] | undefined>(undefined);
  const whitelistedSales: Sale[] = [];

  useEffect(() => {
    if (sales) {
      setAllSales(sales);
    }
  }, [setAllSales, sales]);

  const handleGetWhitelistedSales = async () => {
    console.log("handleGetWhitelistedSales running");
    if (allSales && address) {
      console.log(allSales, address);
      const whitelistedSales = await Promise.all(
        allSales.map(async (sale) => {
          const whitelistedAddresses = await getAddresses(sale.ipfsHash);
          const isWhitelisted =
            whitelistedAddresses.length > 0 &&
            whitelistedAddresses.find(
              (whitelistedAddress) => whitelistedAddress === address
            );
          console.log(isWhitelisted, sale, "handleWhitelistedSales mapping");
          return isWhitelisted ? sale : null;
        })
      ).then((results) =>
        results.filter(
          (sale): sale is NonNullable<typeof sale> => sale !== null
        )
      );
      return whitelistedSales;
    }
    return whitelistedSales;
  };

  return { handleGetWhitelistedSales };
};
