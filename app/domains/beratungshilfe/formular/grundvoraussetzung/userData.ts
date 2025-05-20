import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { type GenericGuard, type Guards } from "../../../guards.server";

export const beratungshilfeGrundvoraussetzungenInputSchema = {
  rechtsschutzversicherung: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  hamburgOderBremen: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiativeGrundvorraussetzung: YesNoAnswer,
};

const _partialSchema = z.object(beratungshilfeGrundvoraussetzungenInputSchema).partial();
export type BeratungshilfeGrundvoraussetzungenUserData = z.infer<typeof _partialSchema>;

export const grundvoraussetzungDone: GenericGuard<
  BeratungshilfeGrundvoraussetzungenUserData
> = ({ context }) =>
  Boolean(
    context.rechtsschutzversicherung === "no" &&
      context.wurdeVerklagt === "no" &&
      context.klageEingereicht === "no" &&
      context.beratungshilfeBeantragt === "no" &&
      context.eigeninitiativeGrundvorraussetzung === "no",
  );

export const beratungshilfeGrundvoraussetzungenGuards = {
  grundvoraussetzungDone,
} satisfies Guards<BeratungshilfeGrundvoraussetzungenUserData>;
