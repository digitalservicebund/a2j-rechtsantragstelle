import mapValues from "lodash/mapValues";
import { hasOptionalString } from "~/domains/guards.server";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { getPersoenlicheDatenXstateConfig } from "~/domains/shared/formular/persoenlicheDaten/xStateConfig";
import { weitereAngabenDone } from "~/domains/shared/formular/weitereAngaben/doneFunctions";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { abgabeXstateConfig } from "./abgabe/xstateConfig";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { beratungshilfeFinanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import type { BeratungshilfeFormularUserData } from "./index";
import { beratungshilfeAntragPages } from "./pages";
import { beratungshilfePersoenlicheDatenDone } from "./persoenlicheDaten/doneFunctions";
import { rechtsproblemXstateConfig } from "./rechtsproblem/xstateConfig";
import type { BeratungshilfeFormularUserData } from "./userData";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

const showNachbefragung = await isFeatureFlagEnabled("showNachbefragung");

export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: stepIds.start,
  meta: {
    arrays: beratungshilfeFormularFinanzielleAngabenArrayConfig(
      "/beratungshilfe/antrag/finanzielle-angaben",
    ),
  },
  states: {
    [stepIds.start]: {
      id: stepIds.antragStart,
      initial: stepIds.start,
      meta: { done: () => true },
      states: {
        start: { on: { SUBMIT: stepIds.grundvoraussetzungen} },
      },
    },
    [stepIds.grundvoraussetzungen]: grundvorraussetzungXstateConfig,
    [stepIds.anwaltlicheVertretung]: anwaltlicheVertretungXstateConfig,
    [stepIds.rechtsproblem]: rechtsproblemXstateConfig,
    [stepIds.finanzielleAngaben]: beratungshilfeFinanzielleAngabenXstateConfig,
    [stepIds.persoenlicheDaten]: getPersoenlicheDatenXstateConfig(
      ({ context }) =>
        beratungshilfePersoenlicheDatenDone({ context }) &&
        hasOptionalString(context.telefonnummer),
      {
        backToCallingFlow: [
          {
            guard:
              finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeldAndEigentumDone,
            target:
              stepIds.zusammenfassung,
          },
          {
            guard:
              finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeldAndHasEigentum,
            target: stepIds.eingentumGesamtwert,
          },
          {
            guard: finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeld,
            target: stepIds.eingentumKraftfahrzeugeFrage,
          },
          {
            guard: finanzielleAngabeGuards.hasAusgabenYes,
            target: stepIds.ausgabenUebersicht,
          },
          {
            guard: finanzielleAngabeGuards.hasNoStaatlicheLeistungen,
            target: stepIds.ausgabenFrage,
          },
          "#finanzielle-angaben.einkommen.staatliche-leistungen",
        ],
        nextFlowEntrypoint: showNachbefragung
          ? stepIds.persoenlichenDatenNachbefragung
          : stepIds.weitereAngaben,
      },
      {
        nachbefragung: {
          on: { BACK: stepIds.persoenlichenDatenNachbefragung, SUBMIT: stepIds.weitereAngaben },
        },
      },
    ),
    [stepIds.weitereAngaben]: {
      id: stepIds.weitereAngaben,
      meta: { done: weitereAngabenDone },
      on: {
        BACK: showNachbefragung
          ? stepIds.persoenlichenDatenNachbefragung
          : stepIds.persoenlicheDatenTelefonnummer,
        SUBMIT: stepIds.abgabe,
      },
    },
    abgabe: await abgabeXstateConfig(stepIds.weitereAngaben),
  },
} satisfies Config<BeratungshilfeFormularUserData>;
