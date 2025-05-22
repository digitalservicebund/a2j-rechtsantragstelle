import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const fluggastrechteGrundvoraussetzungenInputSchema = {
  datenverarbeitungZustimmung: checkedRequired,
  streitbeilegungGruende: z.enum(
    ["yes", "no", "noSpecification"],
    customRequiredErrorMessage,
  ),
  streitbeilegung: z.enum(
    ["yes", "no", "noSpecification"],
    customRequiredErrorMessage,
  ),
};

const _partialSchema = z
  .object(fluggastrechteGrundvoraussetzungenInputSchema)
  .partial();
export type FluggastrechteGrundvoraussetzungenUserData = z.infer<
  typeof _partialSchema
>;
