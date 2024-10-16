import type { NextApiRequest, NextApiResponse } from "next";
import "@shopify/shopify-api/adapters/node";
import { type Address } from "viem";
import { getAddressFromQuery } from "@/utils/getAddressFromQuery";
import { LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import {
  SHOPIFY_API_ACCESS_TOKEN,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_SHOP_NAME
} from "@/constants/shopifyWidget";

interface OrdersReturnType {
  ordersCount: {
    count: number;
  };
}

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  adminApiAccessToken: SHOPIFY_API_ACCESS_TOKEN,
  scopes: ["read_products", "read_discounts", "write_discounts"],
  hostName: SHOPIFY_SHOP_NAME,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  isTesting: true
});

const session = shopify.session.customAppSession(SHOPIFY_SHOP_NAME);
session.accessToken = SHOPIFY_API_ACCESS_TOKEN;

const shopifyAdminClient = new shopify.clients.Graphql({
  session,
  apiVersion: LATEST_API_VERSION
});

const GET_USER_ORDERS = `query getUserOrders($query: String!) {
  ordersCount(query: $query) {
    count
  }
  }`;

export async function hasNeverPlacedOrder(address: Address | undefined) {
  try {
    if (!address) {
      throw new Error("No address provided");
    }

    const ethAddress = await getAddressFromQuery(address);

    const addressSnippet = ethAddress.slice(2, 8);

    const response = await shopifyAdminClient.request(GET_USER_ORDERS, {
      variables: { query: `discount_code:${addressSnippet}` }
    });

    if (!response.data) {
      throw new Error("Could not fetch order data");
    }

    if (response.errors?.message || response.errors?.graphQLErrors?.length) {
      throw new Error("Could not fetch order data");
    }

    const responseData = (await response.data) as OrdersReturnType;

    return {
      userHasNotPlacedOrder: responseData.ordersCount.count === 0
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }

  try {
    const address = req.query.address as Address;

    const ethAddress = await getAddressFromQuery(address);

    const hasNotPlacedOrder = await hasNeverPlacedOrder(ethAddress);

    if (!hasNotPlacedOrder) {
      return res.status(400).json({
        message: "Could not fetch orders placed"
      });
    }

    return res.status(200).json(hasNotPlacedOrder);
  } catch (error) {
    console.error("Error creating cart:", error);
    return res.status(400).json({
      message: "An error has occurred",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
