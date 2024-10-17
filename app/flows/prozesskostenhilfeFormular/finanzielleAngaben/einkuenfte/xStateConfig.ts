import _ from "lodash";
import { and } from "xstate";
import type { Context } from "~/flows/contexts";
import type { Flow } from "~/flows/flows.server";
import type { GenericGuard } from "~/flows/guards.server";
import {
  couldLiveFromUnterhalt,
  unterhaltLeisteIch,
} from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  finanzielleAngabeEinkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { nachueberpruefung } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import {
  isOrganizationCoverageNone,
  isOrganizationCoveragePartly,
} from "~/flows/prozesskostenhilfeFormular/rechtsschutzversicherung/guards";

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

export const getProzesskostenhilfeEinkuenfteSubflow = (
  _doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard = einkuenfteDone,
  subflowPrefix?: PKHEinkuenfteSubflowTypes,
) => {
  const stepIds = _.mapValues(einkuenfteStepIds, (step) =>
    subflowPrefix ? `${subflowPrefix}-${step}` : step,
  );

  const guards =
    subflowPrefix === "partner"
      ? partnerEinkuenfteGuards
      : finanzielleAngabeEinkuenfteGuards;

  /**
   * Special case: we've already asked the antragstellende Person about Unterhalt at the beginning of the Antrag and should skip it
   */
  const shouldSkipUnterhalt: GenericGuard<Context> = () => {
    return subflowPrefix !== "partner";
  };

  return {
    id: stepIds.id,
    initial:
      subflowPrefix === "partner"
        ? stepIds.staatlicheLeistungen
        : stepIds.start,
    meta: { done: einkuenfteDone },
    states: {
      [stepIds.start]: {
        id: stepIds.start,
        on: {
          SUBMIT: stepIds.staatlicheLeistungen,
          BACK: [
            {
              guard: and([nachueberpruefung, unterhaltLeisteIch]),
              target: "#antragstellende-person.zwei-formulare",
            },
            {
              guard: and([
                nachueberpruefung,
                ({ context }) => context.unterhaltsanspruch === "keine",
              ]),
              target: "#antragstellende-person.unterhaltsanspruch",
            },
            {
              guard: and([
                nachueberpruefung,
                ({ context }) => context.unterhaltsanspruch === "unterhalt",
                ({ context }) => context.livesPrimarilyFromUnterhalt === "no",
              ]),
              target:
                "#antragstellende-person.unterhalt-hauptsaechliches-leben",
            },
            {
              guard: and([
                nachueberpruefung,
                ({ context }) => context.unterhaltsanspruch === "unterhalt",
                ({ context }) => context.livesPrimarilyFromUnterhalt === "yes",
              ]),
              target: "#antragstellende-person.eigenes-exemplar",
            },
            {
              guard: and([nachueberpruefung, couldLiveFromUnterhalt]),
              target: "#antragstellende-person.warum-keiner-unterhalt",
            },
            {
              guard: nachueberpruefung,
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
              ? [
                  {
                    guard:
                      "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes",
                    target: "#partner.partner-name",
                  },
                  {
                    guard:
                      "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo",
                    target: "#partner.keine-rolle",
                  },
                  "#partner.partner-einkommen",
                ]
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
                `#${stepIds.id}.${stepIds.abzuege}`,
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
              SUBMIT: `#${stepIds.id}.${stepIds.abzuege}`,
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
            {
              guard: shouldSkipUnterhalt,
              target: stepIds.leistungen,
            },
            stepIds.unterhaltFrage,
          ],
          BACK: [
            {
              guard: guards.notEmployed,
              target: stepIds.einkommen,
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
          SUBMIT: [
            {
              guard: shouldSkipUnterhalt,
              target: stepIds.leistungen,
            },
            stepIds.unterhaltFrage,
          ],
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
              BACK: [
                {
                  guard: and([shouldSkipUnterhalt, guards.receivesPension]),
                  target: `#${stepIds.id}.${stepIds.rente}`,
                },
                {
                  guard: shouldSkipUnterhalt,
                  target: `#${stepIds.id}.${stepIds.renteFrage}`,
                },
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
    },
  } as Flow["config"];
};