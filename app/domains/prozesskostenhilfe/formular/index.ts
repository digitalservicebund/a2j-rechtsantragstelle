import type { Flow } from "~/domains/flows.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import {
  fileUploadRelevant,
  readyForAbgabe,
} from "~/domains/prozesskostenhilfe/formular/abgabe/guards";
import {
  getAbgabeStrings,
  getWeitereDokumenteStrings,
} from "~/domains/prozesskostenhilfe/formular/abgabe/stringReplacements";
import { antragstellendePersonArrayConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/arrayConfiguration";
import { getAntragstellendePersonStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/stringReplacements";
import { getVereinfachteErklaerungStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/stringReplacements";
import { getProzesskostenhilfeAntragstellendePersonConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/xStateConfig";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeEinkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import { grundvoraussetzungenXstateConfig } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/xStateConfig";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { getProzesskostenhilfeRsvXstateConfig } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/xstateConfig";
import { finanzielleAngabenArrayConfig } from "~/domains/shared/formular/finanzielleAngaben/arrayConfiguration";
import { persoenlicheDatenXstateConfig } from "~/domains/shared/formular/persoenlicheDaten/xStateConfig";
import {
  getKinderStrings,
  getArrayIndexStrings,
  geldAnlagenStrings,
} from "~/domains/shared/formular/stringReplacements";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import {
  couldLiveFromUnterhalt,
  empfaengerIsAnderePerson,
} from "./antragstellendePerson/guards";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { gesetzlicheVertretungXstateConfig } from "./gesetzlicheVertretung/xStateConfig";
import {
  erstantragAnwalt,
  isNachueberpruefung,
  versandDigitalGericht,
} from "./grundvoraussetzungen/guards";
import {
  belegeStrings,
  getMissingInformationStrings,
} from "./stringReplacements";
import { type ProzesskostenhilfeFormularUserData } from "./userData";
import { weitereAngabenDone } from "./weitereAngaben/doneFunctions";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
const showPKHZusammenfassung = await isFeatureFlagEnabled(
  "showPKHZusammenfassung",
);

const steps = xStateTargetsFromPagesConfig(prozesskostenhilfeFormularPages);

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
        ...antragstellendePersonArrayConfig(
          "/prozesskostenhilfe/formular/antragstellende-person",
        ),
      },
    },
    states: {
      start: {
        id: "antragStart",
        meta: { done: () => true },
        initial: steps.einkuenfteStart.relative,
        states: {
          [steps.einkuenfteStart.relative]: {
            on: { SUBMIT: "#grundvoraussetzungen" },
          },
        },
      },
      grundvoraussetzungen: grundvoraussetzungenXstateConfig,
      "antragstellende-person":
        getProzesskostenhilfeAntragstellendePersonConfig({
          backToCallingFlow: [
            {
              guard: erstantragAnwalt,
              target: "#grundvoraussetzungen.antrag.klageersteller",
            },
            {
              guard: ({ context }) => versandDigitalGericht({ context }),
              target:
                "#grundvoraussetzungen.einreichung.hinweis-digital-einreichung",
            },
            "#grundvoraussetzungen.einreichung.hinweis-papier-einreichung",
          ],
          nextFlowEntrypoint: [
            {
              guard: ({ context }) => isNachueberpruefung({ context }),
              target: "#finanzielle-angaben",
            },
            "#rechtsschutzversicherung",
          ],
        }),
      rechtsschutzversicherung: getProzesskostenhilfeRsvXstateConfig({
        backToCallingFlow: [
          {
            guard: empfaengerIsAnderePerson,
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
            guard: ({ context }) => context.hasAusgaben === "yes",
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
      "persoenliche-daten": persoenlicheDatenXstateConfig,

      [steps.weitereAngaben.relative]: {
        id: "weitere-angaben",
        meta: { done: weitereAngabenDone },
        on: {
          BACK: "#persoenliche-daten.beruf",
          SUBMIT: steps.abgabe.absolute,
        },
      },
      [steps.abgabe.relative]: {
        id: "abgabe",
        initial: steps.abgabeUeberpruefung.relative,
        meta: { done: () => false },
        states: {
          [steps.abgabeUeberpruefung.relative]: {
            meta: { expandValidation: true },
            on: {
              BACK: steps.weitereAngaben.absolute,
            },
            always: [
              {
                guard: ({ context }) =>
                  readyForAbgabe({ context }) &&
                  Boolean(showPKHZusammenfassung),
                target: steps.zusammenfassung.relative,
              },
              {
                guard: ({ context }) =>
                  readyForAbgabe({ context }) &&
                  fileUploadRelevant({ context }) &&
                  Boolean(showFileUpload),
                target: steps.dokumente.relative,
              },
              {
                guard: readyForAbgabe,
                target: steps.ende.relative,
              },
            ],
          },
          zusammenfassung: {
            on: {
              BACK: steps.weitereAngaben.absolute,
              SUBMIT: [
                {
                  guard: ({ context }) =>
                    fileUploadRelevant({ context }) && Boolean(showFileUpload),
                  target: steps.dokumente.relative,
                },
                steps.ende.relative,
              ],
            },
          },
          [steps.dokumente.relative]: {
            on: {
              BACK: showPKHZusammenfassung
                ? steps.zusammenfassung.relative
                : steps.weitereAngaben.absolute,
              SUBMIT: steps.ende.relative,
            },
          },
          [steps.ende.relative]: {
            on: {
              BACK: [
                {
                  guard: ({ context }) =>
                    Boolean(showFileUpload) && fileUploadRelevant({ context }),
                  target: steps.dokumente.relative,
                },
                {
                  guard: () => Boolean(showPKHZusammenfassung),
                  target: steps.zusammenfassung.relative,
                },
                steps.weitereAngaben.absolute,
              ],
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
  stringReplacements: (context: ProzesskostenhilfeFormularUserData) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAntragstellendePersonStrings(context),
    ...getVereinfachteErklaerungStrings(context),
    ...geldAnlagenStrings(context),
    ...getAbgabeStrings(context),
    ...getMissingInformationStrings(context),
    ...belegeStrings(context),
    ...getWeitereDokumenteStrings(context),
  }),
} satisfies Flow;
