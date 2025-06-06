import { z } from "zod";

export const germanStreetNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine(
    (streetNumber) =>
      /^\d+[/-]?\d?[a-zA-Z]?$/.test(streetNumber.replaceAll(" ", "")),
    { message: "invalid" },
  );
