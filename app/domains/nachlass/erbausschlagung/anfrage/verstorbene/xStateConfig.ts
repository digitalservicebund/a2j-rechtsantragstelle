import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const verstorbeneXStateConfig = {
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
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.testament === "none" || context.testament === "unknown",
            target: stepIds.awarenessDate.relative,
          },
          stepIds.namedInTestament.relative,
        ],
      },
    },
    [stepIds.namedInTestament.relative]: {
      on: {
        BACK: stepIds.testament.relative,
        SUBMIT: [
          {
            guard: ({ context }) => context.namedInTestament === "no",
            target: stepIds.ausschlagungNotNecessary.relative,
          },
          {
            guard: ({ context }) =>
              context.namedInTestament === "yes" &&
              context.testament === "handwritten",
            target: stepIds.letterReceivedFromNachlassgericht.relative,
          },
          {
            guard: ({ context }) =>
              context.namedInTestament === "yes" &&
              (context.testament === "notarized" ||
                context.testament === "erbvertrag"),
            target: stepIds.letterReceivedFromCourt.relative,
          },
        ],
      },
    },
    [stepIds.letterReceivedFromNachlassgericht.relative]: {
      on: {
        BACK: stepIds.namedInTestament.relative,
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.letterReceivedFromNachlassgericht === "no",
            target: stepIds.awarenessDate.relative,
          },
          stepIds.letterReceivedFromCourt.relative,
        ],
      },
    },
    [stepIds.letterReceivedFromCourt.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              context.letterReceivedFromNachlassgericht === "yes",
            target: stepIds.letterReceivedFromNachlassgericht.relative,
          },
          stepIds.namedInTestament.relative,
        ],
        SUBMIT: {
          guard: ({ context }) =>
            objectKeysNonEmpty(context.dateOfReceipt, ["day", "month", "year"]),
          target: "#ausschlagende-person",
        },
      },
    },
    [stepIds.ausschlagungNotNecessary.relative]: {
      on: {
        BACK: stepIds.namedInTestament.relative,
      },
    },
    [stepIds.awarenessDate.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              context.testament === "handwritten" &&
              context.namedInTestament === "yes" &&
              context.letterReceivedFromNachlassgericht === "no",
            target: stepIds.letterReceivedFromNachlassgericht.relative,
          },
          stepIds.testament.relative,
        ],
        SUBMIT: {
          guard: ({ context }) =>
            objectKeysNonEmpty(context.awarenessDate, ["day", "month", "year"]),
          target: "#ausschlagende-person",
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
