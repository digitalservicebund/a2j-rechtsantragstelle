import type { Flow } from "~/flows/flows.server";
import { getAbgabeStrings } from "~/flows/prozesskostenhilfeFormular/abgabe/stringReplacements";
import {
  couldLiveFromUnterhalt,
  unterhaltLeisteIch,
  type ProzesskostenhilfeAntragstellendePersonContext,
} from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import { getAntragstellendePersonStrings } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/stringReplacements";
import { getProzesskostenhilfeAntragstellendePersonConfig } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/xStateConfig";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeEinkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import {
  nachueberpruefung,
  versandDigitalAnwalt,
  versandDigitalGericht,
  type ProzesskostenhilfeGrundvoraussetzungenContext,
} from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import { grundvoraussetzungenXstateConfig } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/xStateConfig";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/flows/prozesskostenhilfeFormular/persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "~/flows/prozesskostenhilfeFormular/rechtsschutzversicherung/doneFunctions";
import { getProzesskostenhilfeRsvXstateConfig } from "~/flows/prozesskostenhilfeFormular/rechtsschutzversicherung/xstateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfeFinanzielleAngabeDone } from "./finanzielleAngaben/doneFunctions";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./gesetzlicheVertretung/context";
import { hasGesetzlicheVertretungYes } from "./gesetzlicheVertretung/guards";
import { gesetzlicheVertretungXstateConfig } from "./gesetzlicheVertretung/xStateConfig";
import type { ProzesskostenhilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { getMissingInformationStrings } from "./stringReplacements";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";
import { getProzesskostenhilfePersoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./rechtsschutzversicherung/context";

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
            guard: finanzielleAngabeGuards.hasAusgabenEntriesYes,
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
        nextFlowEntrypoint: "#abgabe",
      }),
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
              BACK: "#persoenliche-daten.beruf",
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
  }),
} satisfies Flow;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeGrundvoraussetzungenContext &
    ProzesskostenhilfeAntragstellendePersonContext &
    ProzesskostenhilfeRechtsschutzversicherungContext &
    ProzesskostenhilfeFinanzielleAngabenContext &
    ProzesskostenhilfeGesetzlicheVertretung &
    ProzesskostenhilfePersoenlicheDaten;
