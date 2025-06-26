import { decode } from "html-entities";
import { z } from "zod";

export const StringWithHtmlEntities = z
  .string()
  .transform((text) => decode(text));
