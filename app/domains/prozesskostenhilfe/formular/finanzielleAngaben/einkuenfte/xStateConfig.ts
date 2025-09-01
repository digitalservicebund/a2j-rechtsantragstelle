import type { Flow } from "~/domains/flows.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { qualifiesForVereinfachteErklaerung } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { einkuenfteDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";
import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import { pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { isNachueberpruefung } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/guards";
import {
  isOrganizationCoverageNone,
  isOrganizationCoveragePartly,
} from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/guards";
import {
  couldLiveFromUnterhalt,
  empfaengerIsAnderePerson,
  empfaengerIsChild,
} from "../../antragstellendePerson/guards";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenEinkuenftePages,
);

export const finanzielleAngabenEinkuenfteXstateConfig = {
  id: "einkuenfte",
  initial: steps.einkuenfteStart.relative,
  meta: { done: einkuenfteDone },
  states: {
    [steps.einkuenfteStart.relative]: {
      id: steps.einkuenfteStart.relative,
      on: {
        SUBMIT: steps.staatlicheLeistungen.relative,
        BACK: [
          {
            guard: empfaengerIsAnderePerson,
            target: "#antragstellende-person.zwei-formulare",
          },
          {
            guard: ({ context }) =>
              empfaengerIsChild({ context }) &&
              isNachueberpruefung({ context }) &&
              qualifiesForVereinfachteErklaerung({ context }),
            target:
              "#antragstellende-person.vereinfachte-erklaerung.hinweis-vereinfachte-erklaerung",
          },
          {
            guard: ({ context }) =>
              empfaengerIsChild({ context }) &&
              isNachueberpruefung({ context }) &&
              !qualifiesForVereinfachteErklaerung({ context }),
            target:
              "#antragstellende-person.vereinfachte-erklaerung.hinweis-weiteres-formular",
          },
          {
            guard: ({ context }) =>
              isNachueberpruefung({ context }) &&
              context.unterhaltsanspruch === "keine",
            target: "#antragstellende-person.unterhaltsanspruch",
          },
          {
            guard: ({ context }) =>
              isNachueberpruefung({ context }) &&
              context.unterhaltsanspruch === "unterhalt" &&
              context.livesPrimarilyFromUnterhalt === "no",
            target: "#antragstellende-person.unterhalt-hauptsaechliches-leben",
          },
          {
            guard: ({ context }) =>
              isNachueberpruefung({ context }) &&
              context.unterhaltsanspruch === "unterhalt" &&
              context.livesPrimarilyFromUnterhalt === "yes",
            target: "#antragstellende-person.eigenes-exemplar",
          },
          {
            guard: ({ context }) =>
              isNachueberpruefung({ context }) &&
              couldLiveFromUnterhalt({ context }),
            target: "#antragstellende-person.warum-keiner-unterhalt",
          },
          {
            guard: isNachueberpruefung,
            target: "#antragstellende-person.unterhalt-leben-frage",
          },
          {
            guard: ({ context }) => isOrganizationCoveragePartly(context),
            target: "#rechtsschutzversicherung.org-deckung-teilweise",
          },
          {
            guard: ({ context }) => isOrganizationCoverageNone(context),
            target: "#rechtsschutzversicherung.org-deckung-nein",
          },
          "#rechtsschutzversicherung.org-frage",
        ],
      },
    },
    [steps.staatlicheLeistungen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: einkuenfteGuards.staatlicheLeistungenIsBuergergeld,
            target: steps.buergergeld.relative,
          },
          {
            guard: einkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
            target: steps.arbeitslosengeld.relative,
          },
          {
            guard: einkuenfteGuards.staatlicheLeistungenIsKeine,
            target: "einkommen",
          },
          "#gesetzliche-vertretung",
        ],
        BACK: steps.einkuenfteStart.relative,
      },
    },
    [steps.buergergeld.relative]: {
      on: {
        SUBMIT: "einkommen",
        BACK: steps.staatlicheLeistungen.relative,
      },
    },
    [steps.arbeitslosengeld.relative]: {
      on: {
        SUBMIT: "einkommen",
        BACK: steps.staatlicheLeistungen.relative,
      },
    },
    einkommen: {
      id: "einkommen",
      initial: steps.erwerbstaetig.relative,
      states: {
        [steps.erwerbstaetig.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.notEmployed,
                target: steps.renteFrage.absolute,
              },
              steps.art.relative,
            ],
            BACK: [
              {
                guard: einkuenfteGuards.staatlicheLeistungenIsBuergergeld,
                target: steps.buergergeld.absolute,
              },
              {
                guard: einkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
                target: steps.arbeitslosengeld.absolute,
              },
              steps.staatlicheLeistungen.absolute,
            ],
          },
        },
        [steps.art.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.isEmployee,
                target: steps.nettoEinkommen.relative,
              },
              steps.selbststaendig.relative,
            ],
            BACK: steps.erwerbstaetig.relative,
          },
        },
        [steps.nettoEinkommen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.isSelfEmployed,
                target: steps.selbststaendig.relative,
              },
              steps.renteFrage.absolute,
            ],
            BACK: steps.art.relative,
          },
        },
        [steps.selbststaendig.relative]: {
          on: {
            SUBMIT: steps.selbststaendigAbzuege.relative,
            BACK: [
              {
                guard: einkuenfteGuards.isEmployee,
                target: steps.nettoEinkommen.relative,
              },
              steps.art.relative,
            ],
          },
        },
        [steps.selbststaendigAbzuege.relative]: {
          on: {
            BACK: steps.selbststaendig.relative,
            SUBMIT: steps.renteFrage.absolute,
          },
        },
      },
    },
    [steps.renteFrage.relative]: {
      on: {
        SUBMIT: [
          {
            guard: einkuenfteGuards.receivesPension,
            target: steps.rente.relative,
          },
          "#leistungen",
        ],
        BACK: [
          {
            guard: einkuenfteGuards.notEmployed,
            target: "#einkommen",
          },
          {
            guard: ({ context }) =>
              einkuenfteGuards.isSelfEmployed({ context }),
            target: steps.selbststaendigAbzuege.absolute,
          },
          {
            guard: ({ context }) =>
              !einkuenfteGuards.isSelfEmployed({ context }),
            target: steps.nettoEinkommen.absolute,
          },
        ],
      },
    },
    [steps.rente.relative]: {
      on: {
        SUBMIT: steps.leistungenFrage.absolute,
        BACK: steps.renteFrage.relative,
      },
    },
    leistungen: {
      id: "leistungen",
      initial: steps.leistungenFrage.relative,
      states: {
        [steps.leistungenFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasWohngeld,
                target: steps.wohngeld.relative,
              },
              {
                guard: einkuenfteGuards.hasKrankengeld,
                target: steps.krankengeld.relative,
              },
              {
                guard: einkuenfteGuards.hasElterngeld,
                target: steps.elterngeld.relative,
              },
              {
                guard: einkuenfteGuards.hasKindergeld,
                target: steps.kindergeld.relative,
              },
              "#weitere-einkuenfte",
            ],
            BACK: [
              {
                guard: einkuenfteGuards.receivesPension,
                target: steps.rente.absolute,
              },
              steps.renteFrage.absolute,
            ],
          },
        },
        [steps.wohngeld.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasKrankengeld,
                target: steps.krankengeld.relative,
              },
              {
                guard: einkuenfteGuards.hasElterngeld,
                target: steps.elterngeld.relative,
              },
              {
                guard: einkuenfteGuards.hasKindergeld,
                target: steps.kindergeld.absolute,
              },
              "#weitere-einkuenfte",
            ],
            BACK: steps.leistungenFrage.relative,
          },
        },
        [steps.krankengeld.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasElterngeld,
                target: steps.elterngeld.absolute,
              },
              {
                guard: einkuenfteGuards.hasKindergeld,
                target: steps.kindergeld.absolute,
              },
              "#weitere-einkuenfte",
            ],
            BACK: [
              {
                guard: einkuenfteGuards.hasWohngeld,
                target: steps.wohngeld.relative,
              },
              steps.leistungenFrage.relative,
            ],
          },
        },
        [steps.elterngeld.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasKindergeld,
                target: steps.kindergeld.absolute,
              },
              "#weitere-einkuenfte",
            ],
            BACK: [
              {
                guard: einkuenfteGuards.hasKrankengeld,
                target: steps.krankengeld.relative,
              },
              {
                guard: einkuenfteGuards.hasWohngeld,
                target: steps.wohngeld.relative,
              },
              steps.leistungenFrage.relative,
            ],
          },
        },
        [steps.kindergeld.relative]: {
          on: {
            SUBMIT: "#weitere-einkuenfte",
            BACK: [
              {
                guard: einkuenfteGuards.hasElterngeld,
                target: steps.elterngeld.relative,
              },
              {
                guard: einkuenfteGuards.hasKrankengeld,
                target: steps.krankengeld.relative,
              },
              {
                guard: einkuenfteGuards.hasWohngeld,
                target: steps.wohngeld.relative,
              },
              steps.leistungenFrage.relative,
            ],
          },
        },
      },
    },
    "weitere-einkuenfte": {
      id: "weitere-einkuenfte",
      initial: steps.weitereEinkuenfteFrage.relative,
      states: {
        [steps.weitereEinkuenfteFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasFurtherIncome,
                target: steps.weitereEinkuenfteUebersicht.relative,
              },
              {
                guard: ({ context }) =>
                  !einkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  context.currentlyEmployed === "yes",
                target: "#abzuege",
              },
              "#finanzielle-angaben.partner",
            ],
            BACK: [
              {
                guard: einkuenfteGuards.hasKindergeld,
                target: steps.kindergeld.absolute,
              },
              {
                guard: einkuenfteGuards.hasElterngeld,
                target: steps.elterngeld.absolute,
              },
              {
                guard: einkuenfteGuards.hasKrankengeld,
                target: steps.krankengeld.absolute,
              },
              {
                guard: einkuenfteGuards.hasWohngeld,
                target: steps.wohngeld.absolute,
              },
              "#leistungen",
            ],
          },
        },
        [steps.weitereEinkuenfteUebersicht.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.hasFurtherIncomeAndEmptyArray,
                target: steps.weitereEinkuenfteWarnung.relative,
              },
              {
                guard: ({ context }) =>
                  !einkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  context.currentlyEmployed === "yes",
                target: "#abzuege",
              },
              "#finanzielle-angaben.partner",
            ],
            BACK: steps.weitereEinkuenfteFrage.relative,
            "add-weitereEinkuenfte": {
              guard: einkuenfteGuards.isValidEinkuenfteArrayIndex,
              target: "einkunft",
            },
          },
        },
        [steps.weitereEinkuenfteWarnung.relative]: {
          on: {
            BACK: steps.weitereEinkuenfteUebersicht.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  !einkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  context.currentlyEmployed === "yes",
                target: "#abzuege",
              },
              "#finanzielle-angaben.partner",
            ],
          },
        },
        einkunft: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: steps.weitereEinkuenfteUebersicht.absolute,
                SUBMIT: steps.weitereEinkuenfteUebersicht.absolute,
              },
            },
          },
        },
      },
    },
  },
} as Flow["config"];
