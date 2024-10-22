import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtGrundvoraussetzungenDaten = {
  zahlungsaufforderung: YesNoAnswer,
};

const _contextObject = z
  .object(fluggastrechtGrundvoraussetzungenDaten)
  .partial();
export type FluggastrechtGrundvoraussetzungenDaten = z.infer<
  typeof _contextObject
>;
