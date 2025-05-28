import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const beratungshilfeGrundvoraussetzungenInputSchema = {
  rechtsschutzversicherung: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  hamburgOderBremen: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiativeGrundvorraussetzung: YesNoAnswer,
};

const _partialSchema = z
  .object(beratungshilfeGrundvoraussetzungenInputSchema)
  .partial();
export type BeratungshilfeGrundvoraussetzungenUserData = z.infer<
  typeof _partialSchema
>;
