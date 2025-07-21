import mapValues from "lodash/mapValues";
import { hasOptionalString } from "~/domains/guards.server";
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
import { finanzielleAngabenArrayConfig } from "../../shared/formular/finanzielleAngaben/arrayConfiguration";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

const showNachbefragung = await isFeatureFlagEnabled("showNachbefragung");

export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: stepIds.start,
  meta: {
    arrays: {
      ...finanzielleAngabenArrayConfig(
        "/beratungshilfe/antrag/finanzielle-angaben",
      ),
      ...beratungshilfeFormularFinanzielleAngabenArrayConfig(
        "/beratungshilfe/antrag/finanzielle-angaben",
      ),
    },
  },
  states: {
    [stepIds.start]: {
      id: "antragStart",
      initial: "start",
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
              "#finanzielle-angaben.eigentum-zusammenfassung.zusammenfassung",
          },
          {
            guard:
              finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeldAndHasEigentum,
            target: "#finanzielle-angaben.eigentum.gesamtwert",
          },
          {
            guard: finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeld,
            target: "#finanzielle-angaben.eigentum.kraftfahrzeuge-frage",
          },
          {
            guard: finanzielleAngabeGuards.hasAusgabenYes,
            target: "#ausgaben.uebersicht",
          },
          {
            guard: finanzielleAngabeGuards.hasNoStaatlicheLeistungen,
            target: "#ausgaben.ausgaben-frage",
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
    abgabe: await abgabeXstateConfig("#weitere-angaben"),
  },
} satisfies Config<BeratungshilfeFormularUserData>;
