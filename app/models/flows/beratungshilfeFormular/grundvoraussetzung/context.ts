import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const beratungshilfeGrundvoraussetzungen = {
  rechtsschutzversicherung: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiativeGrundvorraussetzung: YesNoAnswer,
};

const contextObject = z.object(beratungshilfeGrundvoraussetzungen).partial();
export type BeratungshilfeGrundvoraussetzungen = z.infer<typeof contextObject>;

export const beratungshilfeGrundvoraussetzungenGuards = {
  rechtsschutzversicherungNo: (context: BeratungshilfeGrundvoraussetzungen) =>
    context.rechtsschutzversicherung === "no",
  wurdeVerklagtNo: (context: BeratungshilfeGrundvoraussetzungen) =>
    context.wurdeVerklagt === "no",
  klageEingereichtNo: (context: BeratungshilfeGrundvoraussetzungen) =>
    context.klageEingereicht === "no",
  beratungshilfeBeantragtNo: (context: BeratungshilfeGrundvoraussetzungen) =>
    context.beratungshilfeBeantragt === "no",

  eigeninitiativeGrundvorraussetzungNo: (
    context: BeratungshilfeGrundvoraussetzungen,
  ) => context.eigeninitiativeGrundvorraussetzung === "no",
};
