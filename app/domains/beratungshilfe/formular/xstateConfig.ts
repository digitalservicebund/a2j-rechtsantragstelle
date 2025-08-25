import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { abgabeXstateConfig } from "./abgabe/xstateConfig";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import { beratungshilfeAntragPages } from "./pages";
import { persoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
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
    "persoenliche-daten": persoenlicheDatenXstateConfig,
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
