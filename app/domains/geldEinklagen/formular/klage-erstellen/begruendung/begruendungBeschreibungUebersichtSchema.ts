import { z } from "zod";

export const begruendungBeschreibungUebersichtZodDescription =
  "begruendungBeschreibungUebersicht";

export const begruendungBeschreibungUebersichtSchema = z
  .string()
  .optional()
  .describe(begruendungBeschreibungUebersichtZodDescription);
