import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";

export const grundvoraussetzungFlowConfig = {
  rechtsschutzversicherung: [
    {
      guard: (context) => context.rechtsschutzversicherung === "no",
      target: "wurdeVerklagt",
    },
    { target: "rechtsschutzversicherungHinweis" },
  ],
  rechtsschutzversicherungHinweis: null,
  wurdeVerklagt: [
    {
      guard: (context) => context.wurdeVerklagt === "no",
      target: "klageEingereicht",
    },
    { target: "wurdeVerklagtHinweis" },
  ],
  wurdeVerklagtHinweis: null,
  klageEingereicht: [
    {
      guard: (context) => context.klageEingereicht === "no",
      target: "hamburgOderBremen",
    },
    { target: "klageEingereichtHinweis" },
  ],
  klageEingereichtHinweis: null,
  hamburgOderBremen: [
    {
      guard: (context) => context.hamburgOderBremen === "yes",
      target: "hamburgOderBremenHinweis",
    },
    { target: "beratungshilfeBeantragt" },
  ],
  hamburgOderBremenHinweis: null,
  beratungshilfeBeantragt: [
    {
      guard: (context) => context.beratungshilfeBeantragt === "no",
      target: "eigeninitiativeGrundvorraussetzung",
    },
    { target: "beratungshilfeBeantragtHinweis" },
  ],
  beratungshilfeBeantragtHinweis: null,
  eigeninitiativeGrundvorraussetzung: [
    {
      guard: (context) =>
        context.rechtsschutzversicherung === "no" &&
        context.wurdeVerklagt === "no" &&
        context.klageEingereicht === "no" &&
        context.beratungshilfeBeantragt === "no" &&
        context.eigeninitiativeGrundvorraussetzung === "no",
      target: "anwaltskanzlei",
    },
    { target: "eigeninitiativeGrundvorraussetzungHinweis" },
  ],
  eigeninitiativeGrundvorraussetzungHinweis: null,
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
