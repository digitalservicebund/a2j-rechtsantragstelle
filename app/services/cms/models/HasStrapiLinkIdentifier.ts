import { z } from "zod";

export const OptionalStrapiLinkIdentifierSchema = z.object({
  identifier: z.string().optional().nullable(),
});
