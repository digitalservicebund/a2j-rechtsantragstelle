import {
  CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularFinanzielleAngabenAbzuegePages } from "./pages";
import { arrayIsNonEmpty } from "~/util/array";

export const finanzielleAngabenAbzuegeFlowConfig = compileFlow({
  pages: pkhFormularFinanzielleAngabenAbzuegePages,
  initialStep: "arbeitsweg",
  transitions: {
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
      {
        target: "arbeitsausgaben",
      },
    ],
    opnvKosten: "arbeitsplatzEntfernung",
    arbeitsplatzEntfernung: "arbeitsausgaben",
    arbeitswegKeineRolle: "arbeitsausgaben",
    arbeitsausgaben: null,
    arbeitsausgabe: null,
    arbeitsausgabenFrage: [
      {
        guard: (context) => context.hasArbeitsausgaben === "yes",
        target: "arbeitsausgabenUebersicht",
      },
      { target: null },
    ],
    arbeitsausgabenUebersicht: [
      {
        guard: (context) =>
          context.hasArbeitsausgaben === "yes" &&
          !arrayIsNonEmpty(context.arbeitsausgaben),
        target: "arbeitsausgabenWarnung",
      },
      { target: null },
    ],
    arbeitsausgabenWarnung: [
        {
          target: null,
        },
    ],
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
