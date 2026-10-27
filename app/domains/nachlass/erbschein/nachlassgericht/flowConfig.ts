import { erbscheinNachlassgerichtPages } from "./pages";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

export const erbscheinNachlassgerichtFlowConfig = compileFlow({
  pages: erbscheinNachlassgerichtPages,
  initialStep: "start",
  transitions: {
    start: "lebensmittelpunkt",
    lebensmittelpunkt: [
      {
        guard: (context) => context.lebensmittelpunkt === "deutschland",
        target: "wohnsituationPflegeheim",
      },
      {
        target: "auslaendischerErbfall",
      },
    ],
    auslaendischerErbfall: null,
    wohnsituationPflegeheim: [
      {
        guard: (context) => context.wohnsituationPflegeheim === "yes",
        target: "plzPflegeheim",
      },
      {
        target: "wohnsituationHospiz",
      },
    ],
    plzPflegeheim: [
      {
        guard: (context) =>
          edgeCasesForPlz(
            context.plzPflegeheim,
            ANGELEGENHEIT_INFO.NACHLASSSACHEN,
          ).length === 0,
        target: "nachlassgerichtErgebnis",
      },
      {
        target: "strasseHausnummer",
      },
    ],
    wohnsituationHospiz: [
      {
        guard: (context) => context.wohnsituationHospiz === "yes",
        target: "plzHospiz",
      },
      {
        target: "plzLebensmittelpunkt",
      },
    ],
    plzHospiz: [
      {
        guard: (context) =>
          edgeCasesForPlz(context.plzHospiz, ANGELEGENHEIT_INFO.NACHLASSSACHEN)
            .length === 0,
        target: "nachlassgerichtErgebnis",
      },
      {
        target: "strasseHausnummer",
      },
    ],
    plzLebensmittelpunkt: [
      {
        guard: (context) =>
          edgeCasesForPlz(
            context.plzLebensmittelpunkt,
            ANGELEGENHEIT_INFO.NACHLASSSACHEN,
          ).length === 0,
        target: "nachlassgerichtErgebnis",
      },
      {
        target: "strasseHausnummer",
      },
    ],
    strasseHausnummer: [
      {
        target: "nachlassgerichtErgebnis",
      },
    ],
    nachlassgerichtErgebnis: [],
  },
}) as CompiledFlow<PageConfigMap>;
