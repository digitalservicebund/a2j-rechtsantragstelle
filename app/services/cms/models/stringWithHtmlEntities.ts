import { decode } from "html-entities";
import { z } from "zod";

export const stringWithHtmlEntities = z
  .string()
  .transform((text) => decode(text));
