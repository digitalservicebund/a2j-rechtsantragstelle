import { z } from "zod";
import type { FieldWidth } from "~/components/inputs/width";

const options = [
  "characters3",
  "characters5",
  "characters7",
  "characters10",
  "characters16",
  "characters24",
  "characters36",
  "characters54",
] as const;

const optionsToFieldWidth = {
  "": undefined,
  characters3: "3",
  characters5: "5",
  characters7: "7",
  characters10: "10",
  characters16: "16",
  characters24: "24",
  characters36: "36",
  characters54: "54",
} as const satisfies Record<string, FieldWidth>;

export const strapiWidthSchema = z.enum(options).nullable();

export const strapiWidthToFieldWidth = (
  strapiWidth: z.infer<typeof strapiWidthSchema>,
) => optionsToFieldWidth[strapiWidth ?? ""];
