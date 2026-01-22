import { z } from "zod";
import { translations } from "~/services/translations/translations";

// ReDoS-safe regex for German house numbers (e.g., "1a", "1-3", "2 1/2" - see test for full list).
// Note: Intentionally allows "1 2" to maintain regex simplicity and avoid complex backtracking.
const houseNumberRegex =
  /^\d+(?:\s*[a-zA-Z])?(?:[\s\-/]+\d+(?:\s*[a-zA-Z])?)*$/;

export const germanHouseNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine((val) => houseNumberRegex.test(val), {
    message: translations.gerichtFinder.invalidHousenumber.de,
  });
