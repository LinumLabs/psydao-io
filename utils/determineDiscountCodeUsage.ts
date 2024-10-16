import { Address } from "viem";

type OrderPlacementResponse = {
  userHasNotPlacedOrder: boolean;
};

export const determineOrderPlacementStatus = async (
  address: Address | undefined
) => {
  try {
    const baseUrl = window.location.origin;
    if (!address) return;
    const orderPlacementRes = await fetch(
      `${baseUrl}/api/discount-usage?address=${address}`,
      {
        method: "GET"
      }
    );

    if (!orderPlacementRes.ok) {
      console.error(
        `Failed to fetch order placement response: ${orderPlacementRes.statusText}`
      );
      return;
    }
    const orderPlacementResponse =
      (await orderPlacementRes.json()) as OrderPlacementResponse;
    return orderPlacementResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching order placement response: ", errorMessage);
    throw error;
  }
};
