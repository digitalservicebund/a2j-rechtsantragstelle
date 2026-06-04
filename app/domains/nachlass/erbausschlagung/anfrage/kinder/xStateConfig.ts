import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import {
  getOptionSorgerecht,
  hasKinderSorgerechtSameAddressNo,
  isKinderAbove18YearsOld,
  isKinderUebersichtFilled,
  isKinderWohnortBeiAntragstellerYes,
  kinderNotFilled,
  shouldBackSorgerechtAddress,
} from "./guards";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const kinderXStateConfig = {
  id: "kinder",
  initial: stepIds.kinderHasKid.relative,
  states: {
    [stepIds.kinderHasKid.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hasKid === "no",
            target: stepIds.abgabeWeitereInformation.absolute,
          },
          stepIds.kinderHowManyKids.relative,
        ],
        BACK: stepIds.ausschlagendePersonRelationToErblasser.absolute,
      },
    },
    [stepIds.kinderHowManyKids.relative]: {
      on: {
        SUBMIT: stepIds.kinderUebersicht.relative,
        BACK: stepIds.kinderHasKid.relative,
      },
    },
    [stepIds.kinderUebersicht.relative]: {
      on: {
        SUBMIT: [
          {
            guard: kinderNotFilled,
            target: stepIds.kinderWarnung.relative,
          },
          {
            guard: isKinderUebersichtFilled,
            target: stepIds.abgabeWeitereInformation.absolute,
          },
          stepIds.kinderWarnungNichtAusgefuellt.relative,
        ],
        BACK: stepIds.kinderHowManyKids.relative,
        "add-kinder": "kinder",
      },
    },
    [stepIds.kinderWarnung.relative]: {
      on: {
        BACK: stepIds.kinderUebersicht.relative,
      },
    },
    [stepIds.kinderWarnungNichtAusgefuellt.relative]: {
      on: {
        BACK: stepIds.kinderUebersicht.relative,
      },
    },
    [stepIds.kinder.relative]: {
      initial: "name",
      meta: { shouldAppearAsMenuNavigation: false },
      states: {
        name: {
          on: {
            BACK: "#kinder.uebersicht",
            SUBMIT: "wohnort",
          },
        },
        wohnort: {
          on: {
            SUBMIT: [
              {
                guard: (context) =>
                  isKinderWohnortBeiAntragstellerYes(context) &&
                  isKinderAbove18YearsOld(context),
                target: "#kinder.uebersicht",
              },
              {
                guard: isKinderWohnortBeiAntragstellerYes,
                target: "sorgerecht",
              },
              "adresse",
            ],
            BACK: "name",
          },
        },
        adresse: {
          on: {
            SUBMIT: [
              {
                guard: isKinderAbove18YearsOld,
                target: "#kinder.uebersicht",
              },
              "sorgerecht",
            ],
            BACK: "wohnort",
          },
        },
        sorgerecht: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => getOptionSorgerecht(context) === "yes",
                target: "erbe-ausschlagende",
              },
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "anotherOrganization",
                target: "sorgerecht-organisation-name",
              },
              "sorgerecht-person",
            ],
            BACK: [
              {
                guard: isKinderWohnortBeiAntragstellerYes,
                target: "wohnort",
              },
              "adresse",
            ],
          },
        },
        "sorgerecht-person": {
          on: {
            SUBMIT: "sorgerecht-gleiche-adresse",
            BACK: "sorgerecht",
          },
        },
        "sorgerecht-gleiche-adresse": {
          on: {
            SUBMIT: [
              {
                guard: hasKinderSorgerechtSameAddressNo,
                target: "sorgerecht-adresse",
              },
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "anotherPerson",
                target: "#kinder.uebersicht",
              },
              "erbe-ausschlagende",
            ],
            BACK: "sorgerecht-person",
          },
        },
        "sorgerecht-adresse": {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "anotherPerson",
                target: "#kinder.uebersicht",
              },
              "erbe-ausschlagende",
            ],
            BACK: "sorgerecht-gleiche-adresse",
          },
        },
        "sorgerecht-organisation-name": {
          on: {
            SUBMIT: "sorgerecht-organisation-adresse",
            BACK: "sorgerecht",
          },
        },
        "sorgerecht-organisation-adresse": {
          on: {
            SUBMIT: "#kinder.uebersicht",
            BACK: "sorgerecht-organisation-name",
          },
        },
        "erbe-ausschlagende": {
          on: {
            SUBMIT: "#kinder.uebersicht",
            BACK: [
              {
                guard: shouldBackSorgerechtAddress,
                target: "sorgerecht-adresse",
              },
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "shared",
                target: "sorgerecht-gleiche-adresse",
              },
              "sorgerecht",
            ],
          },
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
