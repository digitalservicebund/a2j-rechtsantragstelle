import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import { nachlassErbausschlagungGerichtFindenPages } from "./pages";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

const nachlassGerichtFindenPagesWithLeadingSlash = addLeadingSlashToPageSchemas(
  nachlassErbausschlagungGerichtFindenPages,
);

export const nachlassErbausschlagungGerichtFindenFlowConfig = compileFlow({
  pages: nachlassGerichtFindenPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "lebensmittelpunkt",
    lebensmittelpunkt: [
      {
        guard: (context) => context.lebensmittelpunkt === "ausland",
        target: "plz",
      },
      {
        target: "ausschlagungsOrt",
      },
    ],
    ausschlagungsOrt: [
      {
        guard: (context) => context.ausschlagungsOrt === "courtNearMe",
        target: "plz",
      },
      {
        target: "pflegeheim",
      },
    ],
    pflegeheim: [
      {
        guard: (context) => context.pflegeheim === "yes",
        target: "plzPflegeheim",
      },
      {
        target: "hospiz",
      },
    ],
    plzPflegeheim: [
      {
        guard: (context) =>
          edgeCasesForPlz(
            context.plzPflegeheim,
            ANGELEGENHEIT_INFO.NACHLASSSACHEN,
          ).length > 0,
        target: "strasseHausnummer",
      },
      {
        target: "gerichtErmitteltWohnsitz",
      },
    ],
    hospiz: [
      {
        guard: (context) => context.hospiz === "yes",
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
            .length > 0,
        target: "strasseHausnummer",
      },
      {
        target: "gerichtErmitteltWohnsitz",
      },
    ],
    plzLebensmittelpunkt: [
      {
        guard: (context) =>
          edgeCasesForPlz(
            context.plzLebensmittelpunkt,
            ANGELEGENHEIT_INFO.NACHLASSSACHEN,
          ).length > 0,
        target: "strasseHausnummer",
      },
      {
        target: "gerichtErmitteltWohnsitz",
      },
    ],
    plz: [
      {
        guard: (context) =>
          edgeCasesForPlz(context.plz, ANGELEGENHEIT_INFO.NACHLASSSACHEN)
            .length > 0,
        target: "strasseHausnummer",
      },
      {
        target: "gerichtErmitteltWohnsitz",
      },
    ],
    strasseHausnummer: [
      {
        target: "gerichtErmitteltWohnsitz",
      },
    ],
    gerichtErmitteltWohnsitz: null,
  },
}) as CompiledFlow<PageConfigMap>;
