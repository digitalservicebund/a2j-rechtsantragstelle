import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const fluggastrechteGrundvoraussetzungen = {
  datenverarbeitungZustimmung: checkedRequired,
  streitbeilegungGruende: z.enum(
    ["yesAirlineAgainst", "yesOtherReasons", "no"],
    customRequiredErrorMessage,
  ),
  streitbeilegung: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechteGrundvoraussetzungen).partial();
export type FluggastrechteGrundvoraussetzungenContext = z.infer<
  typeof _contextObject
>;
