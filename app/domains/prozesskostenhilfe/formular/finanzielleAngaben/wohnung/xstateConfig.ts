import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenWohnungPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/wohnung/pages";
import type { Config } from "~/services/flow/server/types";
import { wohnungDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenWohnungPages,
);

export const wohnungXstateConfig = {
  id: "wohnung",
  initial: steps.wohnungAlleineZusammen.relative,
  meta: { done: wohnungDone },
  states: {
    [steps.wohnungAlleineZusammen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.livingSituation === "alone",
            target: steps.wohnungGroesse.relative,
          },
          steps.wohnungAnzahlMitbewohner.relative,
        ],
        BACK: [
          {
            guard: "hasWeitereUnterhaltszahlungenYes",
            target: "#andere-unterhaltszahlungen.uebersicht",
          },
          "#andere-unterhaltszahlungen.frage",
        ],
      },
    },
    [steps.wohnungAnzahlMitbewohner.relative]: {
      on: {
        BACK: steps.wohnungAlleineZusammen.relative,
        SUBMIT: steps.wohnungGroesse.relative,
      },
    },
    [steps.wohnungGroesse.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.livingSituation === "alone",
            target: steps.wohnungAlleineZusammen.relative,
          },
          steps.wohnungAnzahlMitbewohner.relative,
        ],
        SUBMIT: steps.wohnungAnzahlZimmer.relative,
      },
    },
    [steps.wohnungAnzahlZimmer.relative]: {
      on: {
        BACK: steps.wohnungGroesse.relative,
        SUBMIT: steps.wohnungMieteEigenheim.relative,
      },
    },
    [steps.wohnungMieteEigenheim.relative]: {
      on: {
        BACK: steps.wohnungAnzahlZimmer.relative,
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.rentsApartment === "yes" &&
              context.livingSituation === "alone",
            target: steps.wohnungMieteAlleine.relative,
          },
          {
            guard: ({ context }) =>
              context.rentsApartment === "no" &&
              context.livingSituation === "alone",
            target: steps.wohnungEigenheimNebenkosten.relative,
          },
          {
            guard: ({ context }) =>
              context.rentsApartment === "no" &&
              (context.livingSituation === "withOthers" ||
                context.livingSituation === "withRelatives"),
            target: steps.wohnungEigenheimNebenkostenGeteilt.relative,
          },
          steps.wohnungMieteZusammen.relative,
        ],
      },
    },
    [steps.wohnungMieteAlleine.relative]: {
      on: {
        BACK: steps.wohnungMieteEigenheim.relative,
        SUBMIT: steps.wohnungNebenkosten.relative,
      },
    },
    [steps.wohnungMieteZusammen.relative]: {
      on: {
        BACK: steps.wohnungMieteEigenheim.relative,
        SUBMIT: steps.wohnungNebenkosten.relative,
      },
    },
    [steps.wohnungNebenkosten.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.livingSituation === "alone",
            target: steps.wohnungMieteAlleine.relative,
          },
          steps.wohnungMieteZusammen.relative,
        ],
        SUBMIT: "#eigentum",
      },
    },
    [steps.wohnungEigenheimNebenkosten.relative]: {
      on: {
        BACK: steps.wohnungMieteEigenheim.relative,
        SUBMIT: "#eigentum",
      },
    },
    [steps.wohnungEigenheimNebenkostenGeteilt.relative]: {
      on: {
        BACK: steps.wohnungMieteEigenheim.relative,
        SUBMIT: "#eigentum",
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
