import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const abzuegeFlowConfig = {
  arbeitsweg: [
    {
      guard: (context) => context.arbeitsweg === "publicTransport",
      target: "opnvKosten",
    },
    {
      guard: (context) => context.arbeitsweg === "privateVehicle",
      target: "arbeitsplatzEntfernung",
    },
    {
      guard: (context) =>
        context.arbeitsweg === "bike" || context.arbeitsweg === "walking",
      target: "arbeitswegKeineRolle",
    },
    { target: "arbeitsausgabenFrage" },
  ],
  opnvKosten: "arbeitsplatzEntfernung",
  arbeitsplatzEntfernung: "arbeitsausgabenFrage",
  arbeitswegKeineRolle: "arbeitsausgabenFrage",
  arbeitsausgaben: [
    {
      guard: (context) => context.hasArbeitsausgaben === "yes",
      target: "arbeitsausgabenUebersicht",
    },
    { target: "partnerschaft" },
  ],
  arbeitsausgabe: "arbeitsausgabenUebersicht",
  arbeitsausgabenFrage: [
    {
      guard: (context) => context.hasArbeitsausgaben === "yes",
      target: "arbeitsausgabenUebersicht",
    },
    { target: "partnerschaft" },
  ],
  arbeitsausgabenUebersicht: [
    {
      type: "addArrayItem",
      target: "arbeitsausgabe",
    },
    {
      guard: (context) =>
        context.hasArbeitsausgaben === "yes" &&
        !arrayIsNonEmpty(context.arbeitsausgaben),
      target: "arbeitsausgabenWarnung",
    },
    { target: "partnerschaft" },
  ],
  arbeitsausgabenWarnung: "partnerschaft",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
