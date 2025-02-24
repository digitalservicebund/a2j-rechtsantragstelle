import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const fluggastrechteGrundvoraussetzungen = {
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

const _contextObject = z.object(fluggastrechteGrundvoraussetzungen).partial();
export type FluggastrechteGrundvoraussetzungenContext = z.infer<
  typeof _contextObject
>;
