import { z } from "zod";

export const pinContentSchema = z.object({
  ipfsHash: z.string()
});

export type PinContentSchema = z.infer<typeof pinContentSchema>;

export type PinContentSchemaResponse = {
  data: PinContentSchema;
};
