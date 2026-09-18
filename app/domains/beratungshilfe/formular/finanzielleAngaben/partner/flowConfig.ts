import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";

export const partnerFlowConfig = {
  partnerschaft: [
    {
      guard: (context) => context.partnerschaft === "yes",
      target: "zusammenleben",
    },
    { target: "kinderFrage" },
  ],
  zusammenleben: [
    {
      guard: (context) =>
        context.partnerschaft === "yes" && context.zusammenleben === "yes",
      target: "partnerEinkommen",
    },
    { target: "unterhalt" },
  ],
  unterhalt: [
    {
      guard: (context) => context.unterhalt === "yes",
      target: "partnerUnterhaltsSumme",
    },
    { target: "keineRolle" },
  ],
  keineRolle: "kinderFrage",
  partnerUnterhaltsSumme: "partnerName",
  partnerName: "kinderFrage",
  partnerEinkommen: [
    {
      guard: (context) => context.partnerEinkommen === "yes",
      target: "partnerEinkommenSumme",
    },
    { target: "kinderFrage" },
  ],
  partnerEinkommenSumme: "kinderFrage",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
