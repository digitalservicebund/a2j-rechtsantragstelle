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
import { pkhFormularFinanzielleAngabenPartnerPages } from "../partner/pages";

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
                  target: "arbeitsausgabe",
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
              initial: "daten",
              states: {
                daten: {
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
              target: "einkunft",
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

export const getProzesskostenhilfePartnerEinkuenfteSubflow = (
  _doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard = einkuenfteDone,
) => {
  const stepIds = mapValues(einkuenfteStepIds, (step) => `partner-${step}`);
  const partnerStepIds = xStateTargetsFromPagesConfig(
    pkhFormularFinanzielleAngabenPartnerPages,
  );

  return {
    id: "partner-einkuenfte",
    initial: stepIds.staatlicheLeistungen,
    meta: { done: einkuenfteDone },
    states: {
      [stepIds.staatlicheLeistungen]: {
        on: {
          SUBMIT: [
            {
              guard: partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
              target: stepIds.buergergeld,
            },
            {
              guard:
                partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
              target: stepIds.arbeitslosengeld,
            },
            {
              guard: partnerEinkuenfteGuards.staatlicheLeistungenIsKeine,
              target: stepIds.einkommen,
            },
            "#kinder",
          ],
          BACK: partnerStepIds.partnerEinkommen.relative,
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
                  guard: partnerEinkuenfteGuards.notEmployed,
                  target: partnerStepIds.partnerRenteFrage.absolute,
                },
                partnerStepIds.partnerArt.relative,
              ],
              BACK: [
                {
                  guard:
                    partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
                  target: partnerStepIds.partnerBuergergeld.absolute,
                },
                {
                  guard:
                    partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
                  target: partnerStepIds.partnerArbeitslosengeld.absolute,
                },
                `#${stepIds.id}.${stepIds.staatlicheLeistungen}`,
              ],
            },
          },
          [stepIds.art]: {
            on: {
              SUBMIT: [
                {
                  guard: partnerEinkuenfteGuards.isEmployee,
                  target: partnerStepIds.partnerNettoEinkommen.relative,
                },
                partnerStepIds.partnerSelbststaendig.relative,
              ],
              BACK: stepIds.erwerbstaetig,
            },
          },
          [stepIds.nettoEinkommen]: {
            on: {
              SUBMIT: [
                {
                  guard: partnerEinkuenfteGuards.isSelfEmployed,
                  target: partnerStepIds.partnerSelbststaendig.relative,
                },
                {
                  guard: ({ context }) =>
                    !partnerEinkuenfteGuards.incomeWithBuergergeld({ context }),
                  target: partnerStepIds.partnerArbeitsausgaben.absolute,
                },
                partnerStepIds.partnerRenteFrage.absolute,
              ],
              BACK: partnerStepIds.partnerArt.relative,
            },
          },
          [stepIds.selbststaendig]: {
            on: {
              SUBMIT: partnerStepIds.partnerSelbststaendigAbzuege.relative,
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.isEmployee,
                  target: partnerStepIds.partnerNettoEinkommen.relative,
                },
                partnerStepIds.partnerArt.relative,
              ],
            },
          },
          [stepIds.selbststaendigAbzuege]: {
            on: {
              BACK: partnerStepIds.partnerSelbststaendig.relative,
              SUBMIT: [
                {
                  guard: ({ context }) =>
                    !partnerEinkuenfteGuards.incomeWithBuergergeld({ context }),
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
                  guard: partnerEinkuenfteGuards.usesPublicTransit,
                  target: partnerStepIds.partnerOpnvKosten.relative,
                },
                {
                  guard: partnerEinkuenfteGuards.usesPrivateVehicle,
                  target: partnerStepIds.partnerArbeitsplatzEntfernung.relative,
                },
                {
                  guard: partnerEinkuenfteGuards.commuteMethodPlaysNoRole,
                  target: partnerStepIds.partnerArbeitswegKeineRolle.absolute,
                },
                `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
              ],
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.isSelfEmployed,
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
                  guard: partnerEinkuenfteGuards.usesPublicTransit,
                  target: partnerStepIds.partnerOpnvKosten.relative,
                },
                partnerStepIds.partnerArbeitsweg.relative,
              ],
            },
          },
          [stepIds.keineRolle]: {
            on: {
              SUBMIT: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
              BACK: stepIds.arbeitsweg,
            },
          },
          [partnerStepIds.partnerArbeitsausgaben.relative]: {
            initial: partnerStepIds.partnerArbeitsausgabenFrage.relative,
            states: {
              [partnerStepIds.partnerArbeitsausgabenFrage.relative]: {
                on: {
                  SUBMIT: [
                    {
                      guard: partnerEinkuenfteGuards.hasAndereArbeitsausgaben,
                      target: stepIds.uebersicht,
                    },
                    `#${stepIds.id}.${stepIds.renteFrage}`,
                  ],
                  BACK: [
                    {
                      guard: partnerEinkuenfteGuards.usesPublicTransit,
                      target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsplatzEntfernung}`,
                    },
                    {
                      guard: partnerEinkuenfteGuards.usesPrivateVehicle,
                      target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsplatzEntfernung}`,
                    },
                    {
                      guard: partnerEinkuenfteGuards.commuteMethodPlaysNoRole,
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
                      guard:
                        partnerEinkuenfteGuards.hasAndereArbeitsausgabenAndEmptyArray,
                      target: stepIds.warnung,
                    },
                    `#${stepIds.id}.${stepIds.renteFrage}`,
                  ],
                  BACK: stepIds.arbeitsausgabenFrage,
                  "add-partner-arbeitsausgaben": {
                    guard:
                      partnerEinkuenfteGuards.isValidArbeitsausgabenArrayIndex,
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
              guard: partnerEinkuenfteGuards.receivesPension,
              target: stepIds.rente,
            },
            stepIds.unterhaltFrage,
          ],
          BACK: [
            {
              guard: partnerEinkuenfteGuards.notEmployed,
              target: stepIds.einkommen,
            },
            {
              guard: ({ context }) =>
                partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                partnerEinkuenfteGuards.isSelfEmployed({ context }),
              target: `#${stepIds.id}.${stepIds.einkommen}.${stepIds.selbststaendigAbzuege}`,
            },
            {
              guard: ({ context }) =>
                partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                !partnerEinkuenfteGuards.isSelfEmployed({ context }),
              target: `#${stepIds.id}.${stepIds.einkommen}.${stepIds.nettoEinkommen}`,
            },
            {
              guard: partnerEinkuenfteGuards.hasAndereArbeitsausgaben,
              target: `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}.${stepIds.uebersicht}`,
            },
            `#${stepIds.id}.${stepIds.abzuege}.${stepIds.arbeitsausgaben}`,
          ],
        },
      },
      [stepIds.rente]: {
        on: {
          SUBMIT: stepIds.unterhaltFrage,
          BACK: stepIds.renteFrage,
        },
      },
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
              guard: partnerEinkuenfteGuards.receivesPension,
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
      [stepIds.leistungen]: {
        initial: stepIds.frage,
        states: {
          [stepIds.frage]: {
            on: {
              SUBMIT: [
                {
                  guard: partnerEinkuenfteGuards.hasWohngeld,
                  target: stepIds.wohngeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKindergeld,
                  target: stepIds.kindergeld,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.receivesSupport,
                  target: `#${stepIds.id}.${stepIds.unterhalt}`,
                },
                `#${stepIds.id}.${stepIds.unterhaltFrage}`,
              ],
            },
          },
          [stepIds.wohngeld]: {
            on: {
              SUBMIT: [
                {
                  guard: partnerEinkuenfteGuards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKindergeld,
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
                  guard: partnerEinkuenfteGuards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.hasWohngeld,
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
                  guard: partnerEinkuenfteGuards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                `#${stepIds.id}.${stepIds.weitereEinkuenfte}`,
              ],
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasWohngeld,
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
                  guard: partnerEinkuenfteGuards.hasElterngeld,
                  target: stepIds.elterngeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKrankengeld,
                  target: stepIds.krankengeld,
                },
                {
                  guard: partnerEinkuenfteGuards.hasWohngeld,
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
        initial: partnerStepIds.partnerWeitereEinkuenfteFrage.relative,
        states: {
          [partnerStepIds.partnerWeitereEinkuenfteFrage.relative]: {
            on: {
              SUBMIT: [
                {
                  guard: partnerEinkuenfteGuards.hasFurtherIncome,
                  target:
                    partnerStepIds.partnerWeitereEinkuenfteUebersicht.relative,
                },
                `#${stepIds.id}.partner-besonders-ausgaben`,
              ],
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.hasKindergeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.kindergeld}`,
                },
                {
                  guard: partnerEinkuenfteGuards.hasElterngeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.elterngeld}`,
                },
                {
                  guard: partnerEinkuenfteGuards.hasKrankengeld,
                  target: `#${stepIds.id}.${stepIds.leistungen}.${stepIds.krankengeld}`,
                },
                {
                  guard: partnerEinkuenfteGuards.hasWohngeld,
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
                  guard: partnerEinkuenfteGuards.hasFurtherIncomeAndEmptyArray,
                  target: stepIds.warnung,
                },
                `#${stepIds.id}.partner-besonders-ausgaben`,
              ],
              BACK: stepIds.frage,
              "add-partner-weitereEinkuenfte": {
                guard: partnerEinkuenfteGuards.isValidEinkuenfteArrayIndex,
                target: stepIds.einkunft,
              },
            },
          },
          [stepIds.warnung]: {
            on: {
              BACK: stepIds.uebersicht,
              SUBMIT: `#${stepIds.id}.partner-besonders-ausgaben`,
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
    },
  } as Flow["config"];
};

// Keep the original function for backward compatibility, but mark it as deprecated
/**
 * @deprecated Use getProzesskostenhilfeSharedEinkuenfteSubflow or getProzesskostenhilfePartnerEinkuenfteSubflow instead
 */
export const getProzesskostenhilfeEinkuenfteSubflow = (
  _doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard = einkuenfteDone,
  subflowPrefix?: PKHEinkuenfteSubflowTypes,
) => {
  if (subflowPrefix === "partner") {
    return getProzesskostenhilfePartnerEinkuenfteSubflow(_doneFunction);
  }
};
