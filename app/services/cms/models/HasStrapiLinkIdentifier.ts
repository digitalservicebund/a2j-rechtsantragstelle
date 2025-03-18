import { z } from "zod";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";

export const OptionalStrapiLinkIdentifierSchema = z.object({
  identifier: StrapiStringOptionalSchema,
});
