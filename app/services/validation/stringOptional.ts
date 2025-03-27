import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "./inputlimits";

export const stringOptionalSchema = z
  .string()
  .trim()
  .max(TEXTAREA_CHAR_LIMIT, {
    message: `You have reached a limit of ${TEXTAREA_CHAR_LIMIT} characters`,
  })
  .optional();
