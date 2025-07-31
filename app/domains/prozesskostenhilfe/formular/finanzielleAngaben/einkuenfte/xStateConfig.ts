import mapValues from "lodash/mapValues";
import { and, or } from "xstate";
import type { Flow } from "~/domains/flows.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { qualifiesForVereinfachteErklaerung } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";
import { einkuenfteDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  finanzielleAngabeEinkuenfteGuards as einkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
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

type PKHEinkuenfteSubflowTypes = "partner";

const einkuenfteStepIds = {
  id: "einkuenfte",
  start: "start",
  staatlicheLeistungen: "staatliche-leistungen",
  buergergeld: "buergergeld",
  arbeitslosengeld: "arbeitslosengeld",
  einkommen: "einkommen",
  abzuege: "abzuege",
  renteFrage: "rente-frage",
  rente: "rente",
  unterhaltFrage: "unterhalt-frage",
  unterhalt: "unterhalt",
  leistungen: "leistungen",
  weitereEinkuenfte: "weitere-einkuenfte",
  erwerbstaetig: "erwerbstaetig",
  art: "art",
  nettoEinkommen: "netto-einkommen",
  selbststaendig: "selbststaendig",
  selbststaendigAbzuege: "selbststaendig-abzuege",
  arbeitsweg: "arbeitsweg",
  opnvKosten: "opnv-kosten",
  frage: "frage",
  uebersicht: "uebersicht",
  wohngeld: "wohngeld",
  krankengeld: "krankengeld",
  elterngeld: "elterngeld",
  kindergeld: "kindergeld",
  arbeitsplatzEntfernung: "arbeitsplatz-entfernung",
  keineRolle: "keine-rolle",
  arbeitsausgaben: "arbeitsausgaben",
  arbeitsausgabe: "arbeitsausgabe",
  arbeitsausgabenFrage: "arbeitsausgaben-frage",
  warnung: "warnung",
  addArbeitsausgaben: "add-arbeitsausgaben",
  daten: "daten",
  addWeitereEinkuenfte: "add-weitereEinkuenfte",
  einkunft: "einkunft",
};

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
            guard: and([
              empfaengerIsChild,
              isNachueberpruefung,
              qualifiesForVereinfachteErklaerung,
            ]),
            target:
              "#antragstellende-person.vereinfachte-erklaerung.hinweis-vereinfachte-erklaerung",
          },
          {
            guard: and([
              empfaengerIsChild,
              isNachueberpruefung,
              ({ context }) => !qualifiesForVereinfachteErklaerung({ context }),
            ]),
            target:
              "#antragstellende-person.vereinfachte-erklaerung.hinweis-weiteres-formular",
          },
          {
            guard: and([
              isNachueberpruefung,
              ({ context }) => context.unterhaltsanspruch === "keine",
            ]),
            target: "#antragstellende-person.unterhaltsanspruch",
          },
          {
            guard: and([
              isNachueberpruefung,
              ({ context }) => context.unterhaltsanspruch === "unterhalt",
              ({ context }) => context.livesPrimarilyFromUnterhalt === "no",
            ]),
            target: "#antragstellende-person.unterhalt-hauptsaechliches-leben",
          },
          {
            guard: and([
              isNachueberpruefung,
              ({ context }) => context.unterhaltsanspruch === "unterhalt",
              ({ context }) => context.livesPrimarilyFromUnterhalt === "yes",
            ]),
            target: "#antragstellende-person.eigenes-exemplar",
          },
          {
            guard: and([isNachueberpruefung, couldLiveFromUnterhalt]),
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
              {
                guard: ({ context }) =>
                  !einkuenfteGuards.incomeWithBuergergeld({ context }),
                target: "#abzuege",
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
            SUBMIT: [
              {
                guard: ({ context }) =>
                  !einkuenfteGuards.incomeWithBuergergeld({ context }),
                target: "#abzuege",
              },
              steps.renteFrage.absolute,
            ],
          },
        },
      },
    },
    abzuege: {
      id: "abzuege",
      initial: steps.arbeitsweg.relative,
      states: {
        [steps.arbeitsweg.relative]: {
          on: {
            SUBMIT: [
              {
                guard: einkuenfteGuards.usesPublicTransit,
                target: steps.opnvKosten.relative,
              },
              {
                guard: einkuenfteGuards.usesPrivateVehicle,
                target: steps.arbeitsplatzEntfernung.relative,
              },
              {
                guard: einkuenfteGuards.commuteMethodPlaysNoRole,
                target: steps.arbeitswegKeineRolle.relative,
              },
              "#arbeitsausgaben",
            ],
            BACK: [
              {
                guard: einkuenfteGuards.isSelfEmployed,
                target: steps.selbststaendigAbzuege.absolute,
              },
              steps.nettoEinkommen.absolute,
            ],
          },
        },
        [steps.opnvKosten.relative]: {
          on: {
            SUBMIT: steps.arbeitsplatzEntfernung.relative,
            BACK: steps.arbeitsweg.relative,
          },
        },
        [steps.arbeitsplatzEntfernung.relative]: {
          on: {
            SUBMIT: "#arbeitsausgaben",
            BACK: [
              {
                guard: einkuenfteGuards.usesPublicTransit,
                target: steps.opnvKosten.relative,
              },
              steps.arbeitsweg.relative,
            ],
          },
        },
        [steps.arbeitswegKeineRolle.relative]: {
          on: {
            SUBMIT: "#arbeitsausgaben",
            BACK: steps.arbeitsweg.relative,
          },
        },
        arbeitsausgaben: {
          id: "arbeitsausgaben",
          initial: steps.arbeitsausgabenFrage.relative,
          states: {
            [steps.arbeitsausgabenFrage.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: einkuenfteGuards.hasAndereArbeitsausgaben,
                    target: steps.arbeitsausgabenUebersicht.relative,
                  },
                  steps.renteFrage.absolute,
                ],
                BACK: [
                  {
                    guard: or([
                      einkuenfteGuards.usesPublicTransit,
                      einkuenfteGuards.usesPrivateVehicle,
                    ]),
                    target: steps.arbeitsplatzEntfernung.absolute,
                  },
                  {
                    guard: einkuenfteGuards.commuteMethodPlaysNoRole,
                    target: steps.arbeitswegKeineRolle.absolute,
                  },
                  steps.arbeitsweg.absolute,
                ],
              },
            },
            [steps.arbeitsausgabenUebersicht.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard:
                      einkuenfteGuards.hasAndereArbeitsausgabenAndEmptyArray,
                    target: steps.arbeitsausgabenWarnung.relative,
                  },
                  steps.renteFrage.absolute,
                ],
                BACK: steps.arbeitsausgabenFrage.relative,
                "add-arbeitsausgaben": {
                  guard: einkuenfteGuards.isValidArbeitsausgabenArrayIndex,
                  target: steps.arbeitsausgabeDaten.absolute,
                },
              },
            },
            [steps.arbeitsausgabenWarnung.relative]: {
              on: {
                BACK: steps.arbeitsausgabenUebersicht.relative,
                SUBMIT: steps.renteFrage.absolute,
              },
            },
            arbeitsausgabe: {
              initial: steps.arbeitsausgabeDaten.relative,
              states: {
                [steps.arbeitsausgabeDaten.relative]: {
                  on: {
                    BACK: steps.arbeitsausgabenUebersicht.absolute,
                    SUBMIT: steps.arbeitsausgabenUebersicht.absolute,
                  },
                },
              },
            },
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
              einkuenfteGuards.incomeWithBuergergeld({ context }) &&
              einkuenfteGuards.isSelfEmployed({ context }),
            target: steps.selbststaendigAbzuege.absolute,
          },
          {
            guard: ({ context }) =>
              einkuenfteGuards.incomeWithBuergergeld({ context }) &&
              !einkuenfteGuards.isSelfEmployed({ context }),
            target: steps.nettoEinkommen.absolute,
          },
          {
            guard: einkuenfteGuards.hasAndereArbeitsausgaben,
            target: steps.arbeitsausgabenUebersicht.absolute,
          },
          "#arbeitsausgaben",
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
              "#partner",
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
              "#partner",
            ],
            BACK: steps.weitereEinkuenfteFrage.relative,
            "add-weitereEinkuenfte": {
              guard: einkuenfteGuards.isValidEinkuenfteArrayIndex,
              target: steps.weitereEinkuenfteDaten.absolute,
            },
          },
        },
        [steps.weitereEinkuenfteWarnung.relative]: {
          on: {
            BACK: steps.weitereEinkuenfteUebersicht.relative,
            SUBMIT: "#partner",
          },
        },
        einkunft: {
          initial: steps.weitereEinkuenfteDaten.relative,
          states: {
            [steps.weitereEinkuenfteDaten.relative]: {
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

export const getProzesskostenhilfeEinkuenfteSubflow = (
  _doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard = einkuenfteDone,
  subflowPrefix?: PKHEinkuenfteSubflowTypes,
) => {
  const stepIds = mapValues(einkuenfteStepIds, (step) =>
    subflowPrefix ? `${subflowPrefix}-${step}` : step,
  );

  const isPartnerFlow = subflowPrefix === "partner";

  const guards = isPartnerFlow ? partnerEinkuenfteGuards : einkuenfteGuards;

  return {
    id: stepIds.id,
    initial: isPartnerFlow ? stepIds.staatlicheLeistungen : stepIds.start,
    meta: { done: einkuenfteDone },
    states: {
      ...(!isPartnerFlow && {
        [stepIds.start]: {
          id: stepIds.start,
          on: {
            SUBMIT: stepIds.staatlicheLeistungen,
            BACK: [
              {
                guard: empfaengerIsAnderePerson,
                target: "#antragstellende-person.zwei-formulare",
              },
              {
                guard: and([
                  empfaengerIsChild,
                  isNachueberpruefung,
                  qualifiesForVereinfachteErklaerung,
                ]),
                target:
                  "#antragstellende-person.vereinfachte-erklaerung.hinweis-vereinfachte-erklaerung",
              },
              {
                guard: and([
                  empfaengerIsChild,
                  isNachueberpruefung,
                  ({ context }) =>
                    !qualifiesForVereinfachteErklaerung({ context }),
                ]),
                target:
                  "#antragstellende-person.vereinfachte-erklaerung.hinweis-weiteres-formular",
              },
              {
                guard: and([
                  isNachueberpruefung,
                  ({ context }) => context.unterhaltsanspruch === "keine",
                ]),
                target: "#antragstellende-person.unterhaltsanspruch",
              },
              {
                guard: and([
                  isNachueberpruefung,
                  ({ context }) => context.unterhaltsanspruch === "unterhalt",
                  ({ context }) => context.livesPrimarilyFromUnterhalt === "no",
                ]),
                target:
                  "#antragstellende-person.unterhalt-hauptsaechliches-leben",
              },
              {
                guard: and([
                  isNachueberpruefung,
                  ({ context }) => context.unterhaltsanspruch === "unterhalt",
                  ({ context }) =>
                    context.livesPrimarilyFromUnterhalt === "yes",
                ]),
                target: "#antragstellende-person.eigenes-exemplar",
              },
              {
                guard: and([isNachueberpruefung, couldLiveFromUnterhalt]),
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
      }),
      [stepIds.staatlicheLeistungen]: {
        on: {
          SUBMIT: [
            {
              guard: guards.staatlicheLeistungenIsBuergergeld,
              target: stepIds.buergergeld,
            },
            {
              guard: guards.staatlicheLeistungenIsArbeitslosengeld,
              target: stepIds.arbeitslosengeld,
            },
            {
              guard: guards.staatlicheLeistungenIsKeine,
              target: stepIds.einkommen,
            },
            subflowPrefix === "partner" ? "#kinder" : "#gesetzliche-vertretung",
          ],
          BACK:
            subflowPrefix === "partner"
              ? "#partner.partner-einkommen"
              : stepIds.start,
        },
      },
      [stepIds.buergergeld]: {
        on: {
          SUBMIT: stepIds.einkommen,
          BACK: stepIds.staatlicheLeistungen,
        },
      },
      [stepIds.arbeitslosengeld]: {
        on: {
          SUBMIT: stepIds.einkommen,
          BACK: stepIds.staatlicheLeistungen,
        },
      },
      [stepIds.einkommen]: {
        initial: stepIds.erwerbstaetig,
        states: {
          [stepIds.erwerbstaetig]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.notEmployed,
                  target: `#${stepIds.id}.${stepIds.renteFrage}`,
                },
                stepIds.art,
              ],
              BACK: [
                {
                  guard: guards.staatlicheLeistungenIsBuergergeld,
                  target: `#${stepIds.id}.${stepIds.buergergeld}`,
                },
                {
                  guard: guards.staatlicheLeistungenIsArbeitslosengeld,
                  target: `#${stepIds.id}.${stepIds.arbeitslosengeld}`,
                },
                `#${stepIds.id}.${stepIds.staatlicheLeistungen}`,
              ],
            },
          },
          [stepIds.art]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.isEmployee,
                  target: stepIds.nettoEinkommen,
                },
                stepIds.selbststaendig,
              ],
              BACK: stepIds.erwerbstaetig,
            },
          },
          [stepIds.nettoEinkommen]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.isSelfEmployed,
                  target: stepIds.selbststaendig,
                },
                {
                  guard: ({ context }) =>
                    !guards.incomeWithBuergergeld({ context }),
                  target: `#${stepIds.id}.${stepIds.abzuege}`,
                },
                `#${stepIds.id}.${stepIds.renteFrage}`,
              ],
              BACK: stepIds.art,
            },
          },
          [stepIds.selbststaendig]: {
            on: {
              SUBMIT: stepIds.selbststaendigAbzuege,
              BACK: [
                {
                  guard: guards.isEmployee,
                  target: stepIds.nettoEinkommen,
                },
                stepIds.art,
              ],
            },
          },
          [stepIds.selbststaendigAbzuege]: {
            on: {
              BACK: stepIds.selbststaendig,
              SUBMIT: [
                {
                  guard: ({ context }) =>
                    !guards.incomeWithBuergergeld({ context }),
                  target: `#${stepIds.id}.${stepIds.abzuege}`,
                },
                `#${stepIds.id}.${stepIds.renteFrage}`,
              ],
            },
          },
        },
      },
      [stepIds.abzuege]: {
        initial: stepIds.arbeitsweg,
        states: {
          [stepIds.arbeitsweg]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.usesPublicTransit,
                  target: stepIds.opnvKosten,
                },
                {
                  guard: guards.usesPrivateVehicle,
                  target: stepIds.arbeitsplatzEntfernung,
                },
                {
                  guard: guards.commuteMethodPlaysNoRole,
                  target: stepIds.keineRolle,
                },
                `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
              ],
              BACK: [
                {
                  guard: guards.isSelfEmployed,
                  target: `#${stepIds.id}.${stepIds.einkommen}.${stepIds.selbststaendigAbzuege}`,
                },
                `#${stepIds.id}.${stepIds.einkommen}.${stepIds.nettoEinkommen}`,
              ],
            },
          },
          [stepIds.opnvKosten]: {
            on: {
              SUBMIT: stepIds.arbeitsplatzEntfernung,
              BACK: stepIds.arbeitsweg,
            },
          },
          [stepIds.arbeitsplatzEntfernung]: {
            on: {
              SUBMIT: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
              BACK: [
                {
                  guard: guards.usesPublicTransit,
                  target: stepIds.opnvKosten,
                },
                stepIds.arbeitsweg,
              ],
            },
          },
          [stepIds.keineRolle]: {
            on: {
              SUBMIT: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
              BACK: stepIds.arbeitsweg,
            },
          },
          [stepIds.arbeitsausgaben]: {
            initial: stepIds.arbeitsausgabenFrage,
            states: {
              [stepIds.arbeitsausgabenFrage]: {
                on: {
                  SUBMIT: [
                    {
                      guard: guards.hasAndereArbeitsausgaben,
                      target: stepIds.uebersicht,
                    },
                    `#${stepIds.id}.${stepIds.renteFrage}`,
                  ],
                  BACK: [
                    {
                      guard: guards.usesPublicTransit,
                      target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsplatzEntfernung}`,
                    },
                    {
                      guard: guards.usesPrivateVehicle,
                      target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsplatzEntfernung}`,
                    },
                    {
                      guard: guards.commuteMethodPlaysNoRole,
                      target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.keineRolle}`,
                    },
                    `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsweg}`,
                  ],
                },
              },
              [stepIds.uebersicht]: {
                on: {
                  SUBMIT: [
                    {
                      guard: guards.hasAndereArbeitsausgabenAndEmptyArray,
                      target: stepIds.warnung,
                    },
                    `#${stepIds.id}.${stepIds.renteFrage}`,
                  ],
                  BACK: stepIds.arbeitsausgabenFrage,
                  [subflowPrefix === "partner"
                    ? "add-partner-arbeitsausgaben"
                    : stepIds.addArbeitsausgaben]: {
                    guard: guards.isValidArbeitsausgabenArrayIndex,
                    target: stepIds.arbeitsausgabe,
                  },
                },
              },
              [stepIds.warnung]: {
                on: {
                  BACK: stepIds.uebersicht,
                  SUBMIT: `#${stepIds.id}.${stepIds.renteFrage}`,
                },
              },
              [stepIds.arbeitsausgabe]: {
                initial: stepIds.daten,
                states: {
                  [stepIds.daten]: {
                    on: {
                      BACK: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}.${stepIds.uebersicht}`,
                      SUBMIT: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}.${stepIds.uebersicht}`,
                    },
                  },
                },
              },
            },
          },
        },
      },
      [stepIds.renteFrage]: {
        on: {
          SUBMIT: [
            {
              guard: guards.receivesPension,
              target: stepIds.rente,
            },
            isPartnerFlow ? stepIds.unterhaltFrage : stepIds.leistungen,
          ],
          BACK: [
            {
              guard: guards.notEmployed,
              target: stepIds.einkommen,
            },
            {
              guard: ({ context }) =>
                guards.incomeWithBuergergeld({ context }) &&
                guards.isSelfEmployed({ context }),
              target: `#${stepIds.id}.${stepIds.einkommen}.${stepIds.selbststaendigAbzuege}`,
            },
            {
              guard: ({ context }) =>
                guards.incomeWithBuergergeld({ context }) &&
                !guards.isSelfEmployed({ context }),
              target: `#${stepIds.id}.${stepIds.einkommen}.${stepIds.nettoEinkommen}`,
            },
            {
              guard: guards.hasAndereArbeitsausgaben,
              target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}.${stepIds.uebersicht}`,
            },
            `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
          ],
        },
      },
      [stepIds.rente]: {
        on: {
          SUBMIT: isPartnerFlow ? stepIds.unterhaltFrage : stepIds.leistungen,
          BACK: stepIds.renteFrage,
        },
      },
      [stepIds.leistungen]: {
        initial: stepIds.frage,
        states: {
          [stepIds.frage]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasWohngeld,
                  target: stepIds.wohngeld,
                },
                {
                  guard: guards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: guards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: guards.hasKindergeld,
                  target: stepIds.kindergeld,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: isPartnerFlow
                ? [
                    {
                      guard: partnerEinkuenfteGuards.receivesSupport,
                      target: `#${stepIds.id}.${stepIds.unterhalt}`,
                    },
                    `#${stepIds.id}.${stepIds.unterhaltFrage}`,
                  ]
                : [
                    {
                      guard: guards.receivesPension,
                      target: `#${stepIds.id}.${stepIds.rente}`,
                    },
                    `#${stepIds.id}.${stepIds.renteFrage}`,
                  ],
            },
          },
          [stepIds.wohngeld]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: guards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: guards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: stepIds.frage,
            },
          },
          [stepIds.krankengeld]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: guards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: [
                {
                  guard: guards.hasWohngeld,
                  target: stepIds.wohngeld,
                },
                stepIds.frage,
              ],
            },
          },
          [stepIds.elterngeld]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: [
                {
                  guard: guards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: guards.hasWohngeld,
                  target: stepIds.wohngeld,
                },
                stepIds.frage,
              ],
            },
          },
          [stepIds.kindergeld]: {
            on: {
              SUBMIT: `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              BACK: [
                {
                  guard: guards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: guards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: guards.hasWohngeld,
                  target: stepIds.wohngeld,
                },
                stepIds.frage,
              ],
            },
          },
        },
      },
      [stepIds.weitereEinkuenfte]: {
        id: stepIds.weitereEinkuenfte,
        initial: stepIds.frage,
        states: {
          [stepIds.frage]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasFurtherIncome,
                  target: stepIds.uebersicht,
                },
                subflowPrefix === "partner"
                  ? `#${stepIds.id}.partner-besonders-ausgaben`
                  : "#partner",
              ],
              BACK: [
                {
                  guard: guards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                {
                  guard: guards.hasElterngeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.elterngeld}`,
                },
                {
                  guard: guards.hasKrankengeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.krankengeld}`,
                },
                {
                  guard: guards.hasWohngeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.wohngeld}`,
                },
                `#${stepIds.id}.${stepIds.leistungen}`,
              ],
            },
          },
          [stepIds.uebersicht]: {
            on: {
              SUBMIT: [
                {
                  guard: guards.hasFurtherIncomeAndEmptyArray,
                  target: stepIds.warnung,
                },
                subflowPrefix === "partner"
                  ? `#${stepIds.id}.partner-besonders-ausgaben`
                  : "#partner",
              ],
              BACK: stepIds.frage,
              [subflowPrefix === "partner"
                ? "add-partner-weitereEinkuenfte"
                : stepIds.addWeitereEinkuenfte]: {
                guard: guards.isValidEinkuenfteArrayIndex,
                target: stepIds.einkunft,
              },
            },
          },
          [stepIds.warnung]: {
            on: {
              BACK: stepIds.uebersicht,
              SUBMIT:
                subflowPrefix === "partner"
                  ? `#${stepIds.id}.partner-besonders-ausgaben`
                  : "#partner",
            },
          },
          [stepIds.einkunft]: {
            initial: stepIds.daten,
            states: {
              [stepIds.daten]: {
                on: {
                  BACK: `#${stepIds.id}.${stepIds.weitereEinkuenfte}.${stepIds.uebersicht}`,
                  SUBMIT: `#${stepIds.id}.${stepIds.weitereEinkuenfte}.${stepIds.uebersicht}`,
                },
              },
            },
          },
        },
      },
      ...(isPartnerFlow && {
        [stepIds.unterhaltFrage]: {
          on: {
            SUBMIT: [
              {
                guard: partnerEinkuenfteGuards.receivesSupport,
                target: stepIds.unterhalt,
              },
              stepIds.leistungen,
            ],
            BACK: [
              {
                guard: guards.receivesPension,
                target: stepIds.rente,
              },
              stepIds.renteFrage,
            ],
          },
        },
        [stepIds.unterhalt]: {
          on: {
            SUBMIT: stepIds.leistungen,
            BACK: stepIds.unterhaltFrage,
          },
        },
      }),
    },
  } as Flow["config"];
};
