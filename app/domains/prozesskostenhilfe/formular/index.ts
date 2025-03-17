import type { Flow } from "~/domains/flows.server";
import { getAbgabeStrings } from "~/domains/prozesskostenhilfe/formular/abgabe/stringReplacements";
import {
  couldLiveFromUnterhalt,
  unterhaltLeisteIch,
  type ProzesskostenhilfeAntragstellendePersonContext,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/context";
import { getAntragstellendePersonStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/stringReplacements";
import { getProzesskostenhilfeAntragstellendePersonConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/xStateConfig";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeEinkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import {
  nachueberpruefung,
  versandDigitalAnwalt,
  versandDigitalGericht,
  type ProzesskostenhilfeGrundvoraussetzungenContext,
} from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/context";
import { grundvoraussetzungenXstateConfig } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/xStateConfig";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/doneFunctions";
import { getProzesskostenhilfeRsvXstateConfig } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/xstateConfig";
import {
  getKinderStrings,
  getArrayIndexStrings,
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
} from "~/domains/shared/formular/stringReplacements";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfeFinanzielleAngabeDone } from "./finanzielleAngaben/doneFunctions";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./gesetzlicheVertretung/context";
import { hasGesetzlicheVertretungYes } from "./gesetzlicheVertretung/guards";
import { gesetzlicheVertretungXstateConfig } from "./gesetzlicheVertretung/xStateConfig";
import type { ProzesskostenhilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { getProzesskostenhilfePersoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./rechtsschutzversicherung/context";
import {
  belegeStrings,
  getMissingInformationStrings,
} from "./stringReplacements";
import type { ProzesskostenhilfeWeitereAngabenContext } from "./weitereAngaben/context";
import { finanzielleAngabenArrayConfig } from "../../shared/formular/finanzielleAngaben/arrayConfiguration";

export const prozesskostenhilfeFormular = {
  flowType: "formFlow",
  config: {
    id: "/prozesskostenhilfe/formular",
    initial: "start",
    meta: {
      arrays: {
        ...finanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
        ...pkhFormularFinanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
      },
    },
    states: {
      start: {
        id: "antragStart",
        meta: { done: () => true },
        initial: "start",
        states: { start: { on: { SUBMIT: "#grundvorsaussetzungen" } } },
      },
      grundvoraussetzungen: grundvoraussetzungenXstateConfig,
      "antragstellende-person":
        getProzesskostenhilfeAntragstellendePersonConfig({
          backToCallingFlow: [
            {
              guard: ({ context }) =>
                versandDigitalAnwalt({ context }) ||
                versandDigitalGericht({ context }),
              target:
                "#grundvorsaussetzungen.einreichung.hinweis-digital-einreichung",
            },
            "#grundvorsaussetzungen.einreichung.hinweis-papier-einreichung",
          ],
          nextFlowEntrypoint: [
            {
              guard: ({ context }) => nachueberpruefung({ context }),
              target: "#finanzielle-angaben",
            },
            "#rechtsschutzversicherung",
          ],
        }),
      rechtsschutzversicherung: getProzesskostenhilfeRsvXstateConfig({
        backToCallingFlow: [
          {
            guard: unterhaltLeisteIch,
            target: "#antragstellende-person.zwei-formulare",
          },
          {
            guard: ({ context }) => context.unterhaltsanspruch === "keine",
            target: "#antragstellende-person.unterhaltsanspruch",
          },
          {
            guard: ({ context }) =>
              context.unterhaltsanspruch === "unterhalt" &&
              context.livesPrimarilyFromUnterhalt === "no",
            target: "#antragstellende-person.unterhalt-hauptsaechliches-leben",
          },
          {
            guard: ({ context }) =>
              context.unterhaltsanspruch === "unterhalt" &&
              context.livesPrimarilyFromUnterhalt === "yes",
            target: "#antragstellende-person.eigenes-exemplar",
          },
          {
            guard: couldLiveFromUnterhalt,
            target: "#antragstellende-person.warum-keiner-unterhalt",
          },
          "#antragstellende-person.unterhalt-leben-frage",
        ],
        nextFlowEntrypoint: "#finanzielle-angaben",
      }),
      "finanzielle-angaben": finanzielleAngabenXstateConfig,
      "gesetzliche-vertretung": gesetzlicheVertretungXstateConfig({
        backToCallingFlow: [
          {
            guard: finanzielleAngabeGuards.hasAusgabenYes,
            target: "#ausgaben-zusammenfassung",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.staatlicheLeistungenIsBuergergeldAndEigentumDone,
            target:
              "#finanzielle-angaben.eigentum-zusammenfassung.zusammenfassung",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
            target: "#finanzielle-angaben.eigentum.kraftfahrzeuge-frage",
          },
          {
            guard:
              finanzielleAngabeEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen,
            target: "#finanzielle-angaben.einkuenfte.staatliche-leistungen",
          },
          "#ausgaben.ausgaben-frage",
        ],
        nextFlowEntrypoint: "#persoenliche-daten",
      }),
      "persoenliche-daten": getProzesskostenhilfePersoenlicheDatenXstateConfig({
        backToCallingFlow: [
          {
            guard: ({ context }) => hasGesetzlicheVertretungYes({ context }),
            target: "#gesetzliche-vertretung.daten",
          },
          "#gesetzliche-vertretung",
        ],
        nextFlowEntrypoint: "#weitere-angaben",
      }),
      "weitere-angaben": {
        id: "weitere-angaben",
        initial: "weitere-angaben",
        meta: { done: prozesskostenhilfePersoenlicheDatenDone },
        states: {
          "weitere-angaben": {
            on: {
              BACK: "#persoenliche-daten.beruf",
              SUBMIT: "#abgabe",
            },
          },
        },
      },
      abgabe: {
        id: "abgabe",
        initial: "ueberpruefung",
        meta: { done: () => false },
        states: {
          ueberpruefung: {
            on: {
              BACK: "#persoenliche-daten.beruf",
            },
            always: {
              guard: ({
                context,
              }: {
                context: ProzesskostenhilfeFormularContext;
              }) =>
                prozesskostenhilfeFinanzielleAngabeDone({ context }) &&
                (rechtsschutzversicherungDone({ context }) ||
                  context.formularArt === "nachueberpruefung") &&
                prozesskostenhilfePersoenlicheDatenDone({
                  context,
                }),
              target: "ende",
            },
          },
          ende: {
            on: {
              BACK: "#weitere-angaben",
            },
          },
        },
      },
    },
  },
  guards: {
    ...finanzielleAngabeGuards,
    ...finanzielleAngabeEinkuenfteGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAntragstellendePersonStrings(context),
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...geldAnlagenStrings(context),
    ...getAbgabeStrings(context),
    ...getMissingInformationStrings(context),
    ...belegeStrings(context),
  }),
} satisfies Flow;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeGrundvoraussetzungenContext &
    ProzesskostenhilfeAntragstellendePersonContext &
    ProzesskostenhilfeRechtsschutzversicherungContext &
    ProzesskostenhilfeFinanzielleAngabenContext &
    ProzesskostenhilfeGesetzlicheVertretung &
    ProzesskostenhilfePersoenlicheDaten &
    ProzesskostenhilfeWeitereAngabenContext;
