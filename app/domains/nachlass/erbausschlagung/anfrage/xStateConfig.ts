import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "./userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const nachlassErbausschlagungAnfrageXStateConfig = {
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
            SUBMIT: "#verstorbene",
          },
        },
      },
    },
    verstorbene: {
      id: "verstorbene",
      initial: stepIds.verstorbeneName.relative,
      states: {
        [stepIds.verstorbeneName.relative]: {
          on: {
            BACK: stepIds.datenverarbeitung.absolute,
            SUBMIT: stepIds.verstorbeneGeburtsdatum.relative,
          },
        },
        [stepIds.verstorbeneGeburtsdatum.relative]: {
          on: {
            BACK: stepIds.verstorbeneName.relative,
            SUBMIT: stepIds.verstorbeneSterbedatum.relative,
          },
        },
        [stepIds.verstorbeneSterbedatum.relative]: {
          on: {
            BACK: stepIds.verstorbeneGeburtsdatum.relative,
            SUBMIT: stepIds.verstorbeneLebensmittelpunkt.relative,
          },
        },
        [stepIds.verstorbeneLebensmittelpunkt.relative]: {
          on: {
            BACK: stepIds.verstorbeneSterbedatum.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.verstorbeneLebensmittelpunkt === "ausland",
                target: stepIds.verstorbeneAuslaendischeAdresse.relative,
              },
              stepIds.pflegeheim.relative,
            ],
          },
        },
        [stepIds.pflegeheim.relative]: {
          on: {
            BACK: stepIds.verstorbeneLebensmittelpunkt.relative,
            SUBMIT: [
              {
                guard: ({ context }) => context.livedInNursingHome === "yes",
                target: stepIds.pflegeheimPLZ.relative,
              },
              stepIds.hospiz.relative,
            ],
          },
        },
        [stepIds.hospiz.relative]: {
          on: {
            BACK: stepIds.pflegeheim.relative,
            SUBMIT: [
              {
                guard: ({ context }) => context.livedInHospice === "yes",
                target: stepIds.plzBeforeHospiz.relative,
              },
              stepIds.verstorbenePlz.relative,
            ],
          },
        },
        [stepIds.plzBeforeHospiz.relative]: {
          on: {
            BACK: stepIds.hospiz.relative,
            SUBMIT: stepIds.verstorbeneAdresse.relative,
          },
        },
        [stepIds.pflegeheimPLZ.relative]: {
          on: {
            BACK: stepIds.pflegeheim.relative,
            SUBMIT: stepIds.verstorbeneAdresse.relative,
          },
        },
        [stepIds.verstorbenePlz.relative]: {
          on: {
            BACK: stepIds.hospiz.relative,
            SUBMIT: stepIds.verstorbeneAdresse.relative,
          },
        },
        [stepIds.verstorbeneAdresse.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) => context.livedInNursingHome === "yes",
                target: stepIds.pflegeheimPLZ.relative,
              },
              {
                guard: ({ context }) => context.livedInHospice === "yes",
                target: stepIds.plzBeforeHospiz.relative,
              },
              stepIds.verstorbenePlz.relative,
            ],
            SUBMIT: stepIds.testament.relative,
          },
        },
        [stepIds.verstorbeneAuslaendischeAdresse.relative]: {
          on: {
            BACK: stepIds.verstorbeneLebensmittelpunkt.relative,
            SUBMIT: stepIds.testament.relative,
          },
        },
        [stepIds.testament.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) =>
                  context.verstorbeneLebensmittelpunkt === "ausland",
                target: stepIds.verstorbeneAuslaendischeAdresse.relative,
              },
              stepIds.verstorbeneAdresse.relative,
            ],
          },
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
