import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { type GenericGuard, type Guards } from "../../guards.server";

export const beratungshilfeGrundvoraussetzungen = {
  rechtsschutzversicherung: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  hamburgOderBremen: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiativeGrundvorraussetzung: YesNoAnswer,
};

const _contextObject = z.object(beratungshilfeGrundvoraussetzungen).partial();
export type BeratungshilfeGrundvoraussetzungen = z.infer<typeof _contextObject>;

export const grundvoraussetzungDone: GenericGuard<
  BeratungshilfeGrundvoraussetzungen
> = ({ context }) =>
  Boolean(
    context.rechtsschutzversicherung === "no" &&
      context.wurdeVerklagt === "no" &&
      context.klageEingereicht === "no" &&
      context.beratungshilfeBeantragt === "no" &&
      context.eigeninitiativeGrundvorraussetzung === "no",
  );

export const beratungshilfeGrundvoraussetzungenGuards = {
  rechtsschutzversicherungNo: ({ context }) =>
    context.rechtsschutzversicherung === "no",
  wurdeVerklagtNo: ({ context }) => context.wurdeVerklagt === "no",
  klageEingereichtNo: ({ context }) => context.klageEingereicht === "no",
  hamburgOderBremenYes: ({ context }) => context.hamburgOderBremen === "yes",
  beratungshilfeBeantragtNo: ({ context }) =>
    context.beratungshilfeBeantragt === "no",
  grundvoraussetzungDone,
} satisfies Guards<BeratungshilfeGrundvoraussetzungen>;
