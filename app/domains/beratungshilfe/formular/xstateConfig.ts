import merge from "lodash/merge";
import persoenlicheDatenFlow from "~/domains/shared/formular/persoenlicheDaten/flow.json";
import type { Config } from "~/services/flow/server/buildFlowController";
import { abgabeXstateConfig } from "./abgabe/xstateConfig";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { beratungshilfeFinanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import type { BeratungshilfeFormularUserData } from "./index";
import { beratungshilfePersoenlicheDatenDone } from "./persoenlicheDaten/doneFunctions";
import { rechtsproblemXstateConfig } from "./rechtsproblem/xstateConfig";
import { finanzielleAngabenArrayConfig } from "../../shared/formular/finanzielleAngaben/arrayConfiguration";

export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: "start",
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
    start: {
      id: "antragStart",
      initial: "start",
      meta: { done: () => true },
      states: {
        start: { on: { SUBMIT: "#grundvoraussetzungen" } },
      },
    },
    grundvoraussetzungen: grundvorraussetzungXstateConfig,
    "anwaltliche-vertretung": anwaltlicheVertretungXstateConfig,
    rechtsproblem: rechtsproblemXstateConfig,
    "finanzielle-angaben": beratungshilfeFinanzielleAngabenXstateConfig,
    "persoenliche-daten": merge(persoenlicheDatenFlow, {
      meta: { done: beratungshilfePersoenlicheDatenDone },
      states: {
        start: {
          on: {
            BACK: [
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
                guard:
                  finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeld,
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
          },
        },
        telefonnummer: {
          on: { SUBMIT: "#weitere-angaben" },
        },
      },
    }),
    "weitere-angaben": {
      id: "weitere-angaben",
      meta: { done: beratungshilfePersoenlicheDatenDone },
      on: { BACK: "#persoenliche-daten.telefonnummer", SUBMIT: "#abgabe" },
    },
    abgabe: await abgabeXstateConfig("#weitere-angaben"),
  },
} satisfies Config<BeratungshilfeFormularUserData>;
