import merge from "lodash/merge";
import persoenlicheDatenFlow from "~/domains/shared/formular/persoenlicheDaten/flow.json";
import { config } from "~/services/env/env.server";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import type { Config } from "~/services/flow/server/buildFlowController";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { beratungshilfeFinanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import type { BeratungshilfeFormularContext } from "./index";
import { beratungshilfePersoenlicheDatenDone } from "./persoenlicheDaten/doneFunctions";
import { rechtsproblemXstateConfig } from "./rechtsproblem/xstateConfig";
import { finanzielleAngabenArrayConfig } from "../../shared/formular/finanzielleAngaben/arrayConfiguration";

const showZusammenfassung = config().ENVIRONMENT !== "production";
const showFileUpload = await isFeatureFlagEnabled("showFileUpload");


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
          on: { SUBMIT: showZusammenfassung ? "#zusammenfassung" : "#abgabe" },
        },
      },
    }),
    ...(showZusammenfassung && {
      zusammenfassung: {
        id: "zusammenfassung",
        initial: "ueberblick",
        meta: { done: () => false },
        states: {
          ueberblick: {
            on: {
              BACK: "#persoenliche-daten.telefonnummer",
              SUBMIT: "#abgabe",
            },
          },
        },
      },
    }),
    abgabe: {
      initial: "ueberpruefung",
        id: "abgabe",
        meta: { done: () => false },
        states: {
          ueberpruefung: {
            on: { BACK: showZusammenfassung ? "#zusammenfassung" : "#persoenliche-daten.telefonnummer" },
            always: {
              guard: beratungshilfeAbgabeGuards.readyForAbgabe,
              target: "art",
            },
          },
      
          art: {
            on: {
              BACK: "#zusammenfassung",
              SUBMIT: [
                {
                  target: "dokumente",
                  guard: beratungshilfeAbgabeGuards.abgabeOnline,
                },
                {
                  target: "ausdrucken",
                  guard: beratungshilfeAbgabeGuards.abgabeAusdrucken,
                },
              ],
            },
          },
      
          ...(showFileUpload && {
            dokumente: { on: { BACK: "art", SUBMIT: "online" } },
          }),
      
          ausdrucken: {
            on: { BACK: { target: "art" } },
          },
          online: { on: { BACK: { target: "art" } } },
        },
    }
  },
} satisfies Config<BeratungshilfeFormularContext>;
