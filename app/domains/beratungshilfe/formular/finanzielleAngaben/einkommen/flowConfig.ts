import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";

export const einkommenFlowConfig = {
  einkommenStart: "staatlicheLeistungen",
  staatlicheLeistungen: [
    {
      guard: (context) => context.staatlicheLeistungen === "buergergeld",
      target: "eigentumInfo",
    },
    {
      guard: (context) => context.staatlicheLeistungen === "keine",
      target: "erwerbstaetig",
    },
    { target: "persoenlicheDatenStart" },
  ],
  erwerbstaetig: [
    {
      guard: (context) => context.erwerbstaetig === "yes",
      target: "berufart",
    },
    { target: "situation" },
  ],
  berufart: "situation",
  situation: "weiteresEinkommen",
  weiteresEinkommen: "einkommen",
  einkommen: "partnerschaft",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
