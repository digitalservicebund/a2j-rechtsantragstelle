import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/buildFlowController";
import { beratungshilfePersoenlicheDatenDone } from "./doneFunctions";
import { berHAntragPersoenlicheDatenPages } from "./pages";
import { type BeratungshilfePersoenlicheDatenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(berHAntragPersoenlicheDatenPages);

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: steps.persoenlicheDatenStart.relative,
  meta: { done: beratungshilfePersoenlicheDatenDone },
  states: {
    [steps.persoenlicheDatenStart.relative]: {
      on: {
        SUBMIT: steps.name.relative,
        BACK: "#einkommen.staatliche-leistungen",
      },
    },
    [steps.name.relative]: {
      on: {
        BACK: steps.persoenlicheDatenStart.relative,
        SUBMIT: steps.geburtsdatum.relative,
      },
    },
    [steps.geburtsdatum.relative]: {
      on: {
        BACK: steps.name.relative,
        SUBMIT: steps.plz.relative,
      },
    },
    [steps.plz.relative]: {
      on: {
        BACK: steps.geburtsdatum.relative,
        SUBMIT: steps.adresse.relative,
      },
    },
    [steps.adresse.relative]: {
      on: {
        BACK: steps.plz.relative,
        SUBMIT: steps.telefonnummer.relative,
      },
    },
    [steps.telefonnummer.relative]: {
      on: {
        BACK: steps.adresse.relative,
        SUBMIT: "#persoenliche-daten.nachbefragung",
      },
    },
  },
} satisfies Config<BeratungshilfePersoenlicheDatenUserData>;
