import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "./userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { verstorbeneXStateConfig } from "./verstorbene/xStateConfig";
import { ausschlagendePersonXStateConfig } from "./ausschlagendePerson/xStateConfig";
import { kinderXStateConfig } from "./kinder/xStateConfig";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const nachlassErbausschlagungAnfrageXStateConfig = {
  meta: {
    arrays: {
      kinder: {
        url: "/nachlass/erbausschlagung/anfrage/kinder/kinder",
        initialInputUrl: "name",
        statementKey: "hasKid",
        hiddenFields: ["wohnortBeiAntragsteller", "geburtsnameSorgerecht"],
        event: "add-kinder",
      },
    },
  },
  id: "/nachlass/erbausschlagung/anfrage",
  initial: "start",
  states: {
    start: {
      id: "start",
      initial: "start",
      states: {
        [stepIds.start.relative]: {
          on: {
            SUBMIT: stepIds.datenverarbeitung.relative,
          },
        },
        [stepIds.datenverarbeitung.relative]: {
          on: {
            BACK: stepIds.start.relative,
            SUBMIT: {
              guard: ({ context }) =>
                context.datenverarbeitungZustimmung === "on",
              target: stepIds.verstorbeneName.absolute,
            },
          },
        },
      },
    },
    verstorbene: verstorbeneXStateConfig,
    "ausschlagende-person": ausschlagendePersonXStateConfig,
    kinder: kinderXStateConfig,
    abgabe: {
      id: "abgabe",
      initial: stepIds.abgabeWeitereInformation.relative,
      states: {
        [stepIds.abgabeWeitereInformation.relative]: {
          on: {
            SUBMIT: {
              guard: ({ context }) =>
                context.weitereInformationen !== undefined,
              target: stepIds.abgabeZusammenfassung.absolute,
            },
            BACK: [
              {
                guard: ({ context }) => context.hasKid === "no",
                target: stepIds.kinderHasKid.absolute,
              },
              stepIds.kinderUebersicht.absolute,
            ],
          },
        },
        [stepIds.abgabeZusammenfassung.relative]: {
          on: {
            SUBMIT: stepIds.abgabeEnde.relative,
            BACK: stepIds.abgabeWeitereInformation.relative,
          },
        },
        [stepIds.abgabeEnde.relative]: {
          on: {
            BACK: stepIds.abgabeZusammenfassung.relative,
          },
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
