import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { beratungshilfePersoenlicheDatenDone } from "./doneFunctions";
import { berHAntragPersoenlicheDatenPages } from "./pages";
import { type BeratungshilfePersoenlicheDatenUserData } from "./userData";
import {
  finanzielleAngabeGuards,
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "../finanzielleAngaben/guards";
import { type BeratungshilfeFinanzielleAngabenUserData } from "../finanzielleAngaben/userData";

const steps = xStateTargetsFromPagesConfig(berHAntragPersoenlicheDatenPages);

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: steps.persoenlicheDatenStart.relative,
  meta: { done: beratungshilfePersoenlicheDatenDone },
  states: {
    [steps.persoenlicheDatenStart.relative]: {
      on: {
        SUBMIT: steps.name.relative,
        BACK: [
          {
            guard: staatlicheLeistungenIsKeine,
            target: "#ausgaben.situation",
          },
          {
            guard: ({ context }) =>
              staatlicheLeistungenIsBuergergeld({ context }) &&
              finanzielleAngabeGuards.hasGrundeigentumYes({ context }),
            target: "#eigentum.grundeigentum.uebersicht",
          },
          {
            guard: staatlicheLeistungenIsBuergergeld,
            target: "#eigentum.grundeigentum",
          },
          "#finanzielle-angaben.einkommen.staatliche-leistungen",
        ],
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
    [steps.nachbefragung.relative]: {
      on: { BACK: steps.telefonnummer.relative, SUBMIT: "#weitere-angaben" },
    },
  },
} satisfies Config<
  BeratungshilfePersoenlicheDatenUserData &
    BeratungshilfeFinanzielleAngabenUserData
>;
