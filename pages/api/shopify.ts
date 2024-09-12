import type { NextApiRequest, NextApiResponse } from "next";
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { type Address, getAddress } from "viem";
import { env } from "@/config/env.mjs";
import { psyNFTMainnet, psyNFTSepolia } from "@/constants/contracts";
import { mainnetClient, sepoliaClient } from "@/constants/publicClient";

interface ShopifyResponse {
  discountCodeBasicCreate: {
    codeDiscountNode: {
      codeDiscount: {
        codes: {
          edges: Array<{
            node: {
              code: string;
            };
          }>;
        };
      };
    };
    userErrors: Array<{ field: string; message: string }>;
  };
}

const SHOPIFY_API_ACCESS_TOKEN = env.SHOPIFY_API_ACCESS_TOKEN;
const SHOPIFY_API_KEY = env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = env.SHOPIFY_API_SECRET;
const SHOPIFY_SHOP_NAME = env.SHOPIFY_SHOP_NAME;
const SHOPIFY_PRODUCT_ID = env.SHOPIFY_PRODUCT_ID;

const NFT_CONTRACT_ADDRESS = env.NEXT_PUBLIC_IS_MAINNET
  ? psyNFTMainnet
  : psyNFTSepolia;

console.debug("SHOPIFY_API_ACCESS_TOKEN => ", SHOPIFY_API_ACCESS_TOKEN);

const shopifyClient = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  adminApiAccessToken: SHOPIFY_API_ACCESS_TOKEN,
  scopes: ["read_products", "read_discounts", "write_discounts"],
  hostName: SHOPIFY_SHOP_NAME,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  isTesting: true
});

const client = env.NEXT_PUBLIC_IS_MAINNET ? mainnetClient : sepoliaClient;

/**
 * Validates that the user has a valid NFT
 * @param ethAddress The user's Ethereum address
 * @returns true if the user has a valid NFT, false otherwise
 * @throws Error if the validation fails
 */
async function validateNFT(ethAddress: Address): Promise<boolean> {
  try {
    const nftBalance: bigint = await client.readContract({
      address: NFT_CONTRACT_ADDRESS as Address,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ name: "owner", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view"
        }
      ],
      functionName: "balanceOf",
      args: [ethAddress]
    });

    if (nftBalance === 0n) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating NFT:", error);
    throw new Error("Failed to validate NFT");
  }
}

async function generateShopifyProductDiscount(
  ethAddress: Address
): Promise<string> {
  // generate a discount code for 100% off here
  console.log(SHOPIFY_SHOP_NAME, "SHOP NAME");
  const session = shopifyClient.session.customAppSession(SHOPIFY_SHOP_NAME);
  session.accessToken = SHOPIFY_API_ACCESS_TOKEN;
  console.log("Session details -> ", {
    shop: session.shop,
    isActive: session.isActive([
      "read_products",
      "read_discounts",
      "write_discounts"
    ]),
    accessToken: session.accessToken ? "Set" : "Not set",
    scopes: session.scope,
    configScope: shopifyClient.config.scopes,
    configAPIKeySet: shopifyClient.config.adminApiAccessToken
      ? "Set"
      : "Not set"
  });
  const client = new shopifyClient.clients.Graphql({
    session,
    apiVersion: LATEST_API_VERSION
  });

  // const discountCode = `PSYDAO-${ethAddress.slice(2, 8)}-${Date.now()}`;
  const discountCode = ethAddress;

  const mutation = `
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            codeDiscount {
              ... on DiscountCodeBasic {
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const variables = {
    basicCodeDiscount: {
      title: `PsyDAO Como Hat Discount for ${ethAddress}`,
      code: discountCode,
      metafields: [
        {
          key: "wallet_address",
          value: ethAddress,
          namespace: "psydao"
        }
      ],
      startsAt: new Date().toISOString(),
      customerSelection: {
        all: true
      },
      usageLimit: 1,
      appliesOncePerCustomer: true,
      customerGets: {
        value: {
          percentage: 1.0
        },
        items: {
          products: {
            productsToAdd: [`gid://shopify/Product/${SHOPIFY_PRODUCT_ID}`]
          }
        }
      }
    }
  };

  try {
    // Note: OLD WAY (deprecated)
    // const response = await client.query({
    //   data: { query: mutation, variables }
    // });

    // Note: NEW WAY
    const response = await client.request(mutation, {
      variables
    });

    console.log(response, "response");

    if (response.data) {
      const result = response.data as ShopifyResponse;
      if (result.discountCodeBasicCreate?.userErrors?.length > 0) {
        const errorMessage =
          result.discountCodeBasicCreate.userErrors[0]?.message ??
          "Unknown error";
        throw new Error(errorMessage);
      }

      return discountCode;
    }
    console.log(discountCode, "over here");
    throw new Error(`Failed to generate discount code: ${discountCode}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        shopName: SHOPIFY_SHOP_NAME,
        hasAccessToken: !!SHOPIFY_API_ACCESS_TOKEN
      });
    } else {
      console.error("Error details:", {
        message: error,
        shopName: SHOPIFY_SHOP_NAME,
        hasAccessToken: !!SHOPIFY_API_ACCESS_TOKEN
      });
    }
    throw new Error(`Failed to generate discount code: ${discountCode}`);
  }
}

// async function validateDiscountCode(code: string) {
//   const session = shopifyClient.session.customAppSession(SHOPIFY_SHOP_NAME);
//   session.accessToken = SHOPIFY_API_ACCESS_TOKEN;
//   const client = new shopifyClient.clients.Graphql({
//     session,
//     apiVersion: LATEST_API_VERSION
//   });

//   const query = `
//           query getDiscountCode($code: String!) {
//             codeDiscountNodeByCode(code: $code) {
//               codeDiscount {
//                 ... on DiscountCodeBasic {
//                   codes(first: 1) {
//                     edges {
//                       node {
//                         code
//                         usageCount
//                       }
//                     }
//                   }
//                   usageLimit
//                   status
//                 }
//               }
//             }
//           }
//         `;
//   try {
//     const response = await client.request(query, {
//       variables: {
//         code: code
//       }
//     });

//     if (response.data) {
//       return response.data;
//     }
//     throw new Error("Failed to validate discount code");
//   } catch (error) {
//     console.error("Error validating discount code:", error);
//     throw new Error("Failed to validate discount code");
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }

  try {
    const ethAddress = req.query.ethAddress as Address;
    if (!ethAddress || !getAddress(ethAddress)) {
      return res.status(400).json({
        message: "ethAddress is required"
      });
    }

    const hasNFT = await validateNFT(ethAddress);
    if (!hasNFT) {
      return res.status(403).json({
        message: "User does not have a valid NFT"
      });
    }

    const discountCode = await generateShopifyProductDiscount(ethAddress);
    // const discountCodeValid = await validateDiscountCode(discountCode);

    return res.status(200).json({
      discountCode: discountCode
      // discountCodeValid: discountCodeValid
    });
  } catch (error) {
    console.error("Error generating discount code:", error);
    return res.status(400).json({
      message: "An error has occurred",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
