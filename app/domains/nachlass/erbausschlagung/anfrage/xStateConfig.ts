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
              "", // TODO: ask about hospice/nursing home
            ],
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
              "", // TODO: redirect from weitere adressdaten
            ],
          },
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
