import { z } from "zod";
import { persoenlicheDaten } from "~/flows/shared/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtePersoenlichDaten = {
  ...persoenlicheDaten,
  isWeiterePersonen: YesNoAnswer,
  weiterePersonen: z.array(
    z
      .object({
        ...persoenlicheDaten,
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
