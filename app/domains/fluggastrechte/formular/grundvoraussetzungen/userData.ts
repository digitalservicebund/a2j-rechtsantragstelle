import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";

export const fluggastrechteGrundvoraussetzungenInputSchema = {
  datenverarbeitungZustimmung: checkedRequired,
  streitbeilegungGruende: z.enum(["yes", "no", "noSpecification"]),
  streitbeilegung: z.enum(["yes", "no", "noSpecification"]),
};

const _partialSchema = z
  .object(fluggastrechteGrundvoraussetzungenInputSchema)
  .partial();
export type FluggastrechteGrundvoraussetzungenUserData = z.infer<
  typeof _partialSchema
>;
