import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import type { ErbausschlagungAnfragePages } from "../pages";
import {
  getOptionSorgerecht,
  hasKinderSorgerechtSameAddressNo,
  isKinderAbove18YearsOld,
  isKinderUebersichtFilled,
  isKinderWohnortBeiAntragstellerYes,
  kinderNotFilled,
} from "./guards";

export const kinderFlowConfig = {
  kinderHasKid: [
    {
      guard: (context) => context.hasKid === "no",
      target: "abgabeWeitereInformation",
    },
    {
      target: "kinderHowManyKids",
    },
  ],
  kinderHowManyKids: "kinderUebersicht",
  kinderUebersicht: [
    {
      type: "addArrayItem",
      target: "kinderName",
    },
    {
      guard: (context) => kinderNotFilled({ context }),
      target: "kinderWarnung",
    },
    {
      guard: (context) => isKinderUebersichtFilled({ context }),
      target: "abgabeWeitereInformation",
    },
    {
      target: "kinderWarnungNichtAusgefuellt",
    },
  ],
  kinderName: "kinderWohnort",
  kinderWohnort: [
    {
      guard: (context) =>
        isKinderWohnortBeiAntragstellerYes({ context }) &&
        isKinderAbove18YearsOld({ context }),
      target: "kinderUebersicht",
    },
    {
      guard: (context) => isKinderWohnortBeiAntragstellerYes({ context }),
      target: "sorgerecht",
    },
    {
      guard: (context) => isKinderAbove18YearsOld({ context }),
      target: "kinderAdresseOptional",
    },
    {
      target: "kinderAdresse",
    },
  ],
  kinderAdresse: "sorgerecht",
  kinderAdresseOptional: "kinderUebersicht",
  kinderWarnung: null,
  kinderWarnungNichtAusgefuellt: null,
  sorgerecht: [
    {
      guard: (context) => getOptionSorgerecht(context) === "yes",
      target: "erbeAusschlagende",
    },
    {
      guard: (context) =>
        getOptionSorgerecht(context) === "anotherOrganization",
      target: "sorgerechtOrganisationName",
    },
    {
      target: "sorgerechtPerson",
    },
  ],
  sorgerechtPerson: "sorgerechtGleicheAdresse",
  sorgerechtGleicheAdresse: [
    {
      guard: (context) => hasKinderSorgerechtSameAddressNo({ context }),
      target: "sorgerechtAdresse",
    },
    {
      guard: (context) => getOptionSorgerecht(context) === "anotherPerson",
      target: "kinderUebersicht",
    },
    {
      target: "erbeAusschlagende",
    },
  ],
  sorgerechtAdresse: [
    {
      guard: (context) => getOptionSorgerecht(context) === "anotherPerson",
      target: "kinderUebersicht",
    },
    {
      target: "erbeAusschlagende",
    },
  ],
  sorgerechtOrganisationName: "sorgerechtOrganisationAdresse",
  sorgerechtOrganisationAdresse: "kinderUebersicht",
  erbeAusschlagende: "kinderUebersicht",
} satisfies Partial<TransitionConfigMap<ErbausschlagungAnfragePages>>;
