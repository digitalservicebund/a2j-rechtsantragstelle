import type { Flow } from "~/domains/flows.server";
import {
  getAbgabeStrings,
  getWeitereDokumenteStrings,
} from "~/domains/prozesskostenhilfe/formular/abgabe/stringReplacements";
import { antragstellendePersonArrayConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/arrayConfiguration";
import { getAntragstellendePersonStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/stringReplacements";
import { qualifiesForVereinfachteErklaerung } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { getVereinfachteErklaerungStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/stringReplacements";
import { getProzesskostenhilfeAntragstellendePersonConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/xStateConfig";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabeEinkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/doneFunctions";
import { grundvoraussetzungenXstateConfig } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/xStateConfig";
import { prozesskostenhilfePersoenlicheDatenDone } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/doneFunctions";
import { getProzesskostenhilfeRsvXstateConfig } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/xstateConfig";
import { finanzielleAngabenArrayConfig } from "~/domains/shared/formular/finanzielleAngaben/arrayConfiguration";
import {
  getKinderStrings,
  getArrayIndexStrings,
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
} from "~/domains/shared/formular/stringReplacements";
import { weitereAngabenDone } from "~/domains/shared/formular/weitereAngaben/doneFunctions";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import {
  couldLiveFromUnterhalt,
  empfaengerIsAnderePerson,
  empfaengerIsChild,
} from "./antragstellendePerson/guards";
import { prozesskostenhilfeFinanzielleAngabeDone } from "./finanzielleAngaben/doneFunctions";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { finanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import { hasGesetzlicheVertretungYes } from "./gesetzlicheVertretung/guards";
import { gesetzlicheVertretungXstateConfig } from "./gesetzlicheVertretung/xStateConfig";
import {
  isNachueberpruefung,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "./grundvoraussetzungen/guards";
import { getProzesskostenhilfePersoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
import {
  belegeStrings,
  getMissingInformationStrings,
} from "./stringReplacements";
import { type ProzesskostenhilfeFormularUserData } from "./userData";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");

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
              guard: ({ context }) => isNachueberpruefung({ context }),
              target: "#finanzielle-angaben",
            },
            "#rechtsschutzversicherung",
          ],
        }),
      rechtsschutzversicherung: getProzesskostenhilfeRsvXstateConfig({
        backToCallingFlow: [
          {
            guard: ({ context }) =>
              empfaengerIsChild({ context }) &&
              qualifiesForVereinfachteErklaerung({ context }),
            target: "#vereinfachte-erklaerung.hinweis-vereinfachte-erklaerung",
          },
          {
            guard: ({ context }) =>
              empfaengerIsChild({ context }) &&
              !qualifiesForVereinfachteErklaerung({ context }),
            target: "#vereinfachte-erklaerung.hinweis-weiteres-formular",
          },
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
        meta: { done: weitereAngabenDone },
        on: {
          BACK: "#persoenliche-daten.beruf",
          SUBMIT: "#abgabe",
        },
      },
      abgabe: {
        id: "abgabe",
        initial: "ueberpruefung",
        meta: { done: () => false },
        states: {
          ueberpruefung: {
            on: {
              BACK: "#weitere-angaben",
            },
            always: {
              guard: ({
                context,
              }: {
                context: ProzesskostenhilfeFormularUserData;
              }) =>
                prozesskostenhilfeFinanzielleAngabeDone({ context }) &&
                prozesskostenhilfeGesetzlicheVertretungDone({ context }) &&
                (rechtsschutzversicherungDone({ context }) ||
                  context.formularArt === "nachueberpruefung") &&
                prozesskostenhilfePersoenlicheDatenDone({
                  context,
                }),
              target: showFileUpload ? "dokumente" : "ende",
            },
          },
          ...(showFileUpload && {
            dokumente: { on: { BACK: "#weitere-angaben", SUBMIT: "ende" } },
          }),
          ende: {
            on: {
              BACK: showFileUpload ? "dokumente" : "#weitere-angaben",
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
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...geldAnlagenStrings(context),
    ...getAbgabeStrings(context),
    ...getMissingInformationStrings(context),
    ...belegeStrings(context),
    ...getWeitereDokumenteStrings(context),
  }),
} satisfies Flow;
