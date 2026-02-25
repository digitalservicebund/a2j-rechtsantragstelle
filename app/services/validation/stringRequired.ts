import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "./inputlimits";

export const stringRequiredSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .max(TEXTAREA_CHAR_LIMIT, { message: "max" });

export const stringRequiredMaxSchema = ({ max }: { max?: number } = {}) =>
  z
    .string()
    .trim()
    .min(1, { message: "required" })
    .max(max ?? TEXTAREA_CHAR_LIMIT, { message: "max" });
