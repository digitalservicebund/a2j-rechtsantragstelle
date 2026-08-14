import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import type { NachlassErbausschlagungAnfragePages } from "../pages";
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
      guard: (data) => data.hasKid === "no",
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
      guard: (data) => kinderNotFilled({ context: data }),
      target: "kinderWarnung",
    },
    {
      guard: (data) => isKinderUebersichtFilled({ context: data }),
      target: "abgabeWeitereInformation",
    },
    {
      target: "kinderWarnungNichtAusgefuellt",
    },
  ],

  kinderName: "kinderWohnort",

  kinderWohnort: [
    {
      guard: (data) =>
        isKinderWohnortBeiAntragstellerYes({ context: data }) &&
        isKinderAbove18YearsOld({ context: data }),
      target: "kinderUebersicht",
    },
    {
      guard: (data) => isKinderWohnortBeiAntragstellerYes({ context: data }),
      target: "sorgerecht",
    },
    {
      guard: (data) => isKinderAbove18YearsOld({ context: data }),
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
      guard: (data) => getOptionSorgerecht(data) === "yes",
      target: "erbeAusschlagende",
    },
    {
      guard: (data) => getOptionSorgerecht(data) === "anotherOrganization",
      target: "sorgerechtOrganisationName",
    },
    {
      target: "sorgerechtPerson",
    },
  ],

  sorgerechtPerson: "sorgerechtGleicheAdresse",

  sorgerechtGleicheAdresse: [
    {
      guard: (data) => hasKinderSorgerechtSameAddressNo({ context: data }),
      target: "sorgerechtAdresse",
    },
    {
      guard: (data) => getOptionSorgerecht(data) === "anotherPerson",
      target: "kinderUebersicht",
    },
    {
      target: "erbeAusschlagende",
    },
  ],

  sorgerechtAdresse: [
    {
      guard: (data) => getOptionSorgerecht(data) === "anotherPerson",
      target: "kinderUebersicht",
    },
    {
      target: "erbeAusschlagende",
    },
  ],

  sorgerechtOrganisationName: "sorgerechtOrganisationAdresse",

  sorgerechtOrganisationAdresse: "kinderUebersicht",

  erbeAusschlagende: "kinderUebersicht",
} satisfies Partial<TransitionConfigMap<NachlassErbausschlagungAnfragePages>>;
