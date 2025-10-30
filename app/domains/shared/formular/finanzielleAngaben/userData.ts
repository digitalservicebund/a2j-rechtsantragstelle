import { z } from "zod";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";

export const eigentuemerInputSchema = z.enum([
  "myself",
  "partner",
  "myselfAndPartner",
  "myselfAndSomeoneElse",
]);

export type Eigentumer = z.infer<typeof eigentuemerInputSchema>;

export const staatlicheLeistungenInputSchema = z.enum([
  "grundsicherung",
  "asylbewerberleistungen",
  "buergergeld",
  "keine",
]);

export const besondereBelastungen = [
  "pregnancy",
  "singleParent",
  "disability",
  "medicalReasons",
  "none",
] as const;

export const besondereBelastungenInputSchema =
  exclusiveCheckboxesSchema(besondereBelastungen);
