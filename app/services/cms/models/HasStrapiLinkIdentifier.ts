import { z } from "zod";

export const OptionalStrapiLinkIdentifierSchema = z.object({
  identifier: z.string().nullable(),
});
