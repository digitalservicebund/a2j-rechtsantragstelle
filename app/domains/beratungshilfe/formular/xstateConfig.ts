import { hasOptionalString } from "~/domains/guards.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { getPersoenlicheDatenXstateConfig } from "~/domains/shared/formular/persoenlicheDaten/xStateConfig";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { abgabeXstateConfig } from "./abgabe/xstateConfig";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import { beratungshilfeAntragPages } from "./pages";
import { beratungshilfePersoenlicheDatenDone } from "./persoenlicheDaten/doneFunctions";
import { rechtsproblemXstateConfig } from "./rechtsproblem/xstateConfig";
import type { BeratungshilfeFormularUserData } from "./userData";
import { weitereAngabenDone } from "./weitereAngaben/doneFunctions";

const showNachbefragung = await isFeatureFlagEnabled("showNachbefragung");

const steps = xStateTargetsFromPagesConfig(beratungshilfeAntragPages);

export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: "start",
  meta: {
    arrays: beratungshilfeFormularFinanzielleAngabenArrayConfig(
      "/beratungshilfe/antrag/finanzielle-angaben",
    ),
  },
  states: {
    start: {
      id: "antragStart",
      initial: "start",
      meta: { done: () => true },
      states: {
        [steps.start.relative]: { on: { SUBMIT: "#grundvoraussetzungen" } },
      },
    },
    grundvoraussetzungen: grundvorraussetzungXstateConfig,
    "anwaltliche-vertretung": anwaltlicheVertretungXstateConfig,
    rechtsproblem: rechtsproblemXstateConfig,
    "finanzielle-angaben": finanzielleAngabenXstateConfig,
    "persoenliche-daten": getPersoenlicheDatenXstateConfig(
      ({ context }) =>
        beratungshilfePersoenlicheDatenDone({ context }) &&
        hasOptionalString(context.telefonnummer),
      {
        backToCallingFlow: [
          {
            guard: ({ context }) =>
              staatlicheLeistungenIsKeine({ context }) &&
              finanzielleAngabeGuards.hasAusgabenYes({ context }),
            target: "#ausgaben.uebersicht",
          },
          {
            guard: staatlicheLeistungenIsKeine,
            target: "#ausgaben",
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
        nextFlowEntrypoint: showNachbefragung
          ? "nachbefragung"
          : "#weitere-angaben",
      },
      {
        nachbefragung: {
          on: { BACK: "telefonnummer", SUBMIT: "#weitere-angaben" },
        },
      },
    ),
    "weitere-angaben": {
      id: "weitere-angaben",
      meta: { done: weitereAngabenDone },
      on: {
        BACK: showNachbefragung
          ? "#persoenliche-daten.nachbefragung"
          : "#persoenliche-daten.telefonnummer",
        SUBMIT: "#abgabe",
      },
    },
    abgabe: abgabeXstateConfig,
  },
} satisfies Config<BeratungshilfeFormularUserData>;
