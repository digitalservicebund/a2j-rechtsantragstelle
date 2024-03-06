import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import type { Guards } from "../../guards.server";

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
  rechtsschutzversicherungNo: ({ context }) =>
    context.rechtsschutzversicherung === "no",
  wurdeVerklagtNo: ({ context }) => context.wurdeVerklagt === "no",
  klageEingereichtNo: ({ context }) => context.klageEingereicht === "no",
  beratungshilfeBeantragtNo: ({ context }) =>
    context.beratungshilfeBeantragt === "no",
  eigeninitiativeGrundvorraussetzungNo: ({ context }) =>
    context.eigeninitiativeGrundvorraussetzung === "no",
} satisfies Guards<BeratungshilfeGrundvoraussetzungen>;

export const grundvoraussetzungDone = (
  context: BeratungshilfeGrundvoraussetzungen,
) =>
  Boolean(
    context.rechtsschutzversicherung === "no" &&
      context.wurdeVerklagt === "no" &&
      context.klageEingereicht === "no" &&
      context.beratungshilfeBeantragt === "no",
  );
