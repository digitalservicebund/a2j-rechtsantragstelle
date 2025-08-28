import { type Flow } from "~/domains/flows.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { partnerDone } from "../doneFunctions";
import { einkuenfteDone } from "../einkuenfte/doneFunctions";
import { partnerEinkuenfteGuards } from "../einkuenfte/guards";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenPartnerPages,
);

export const partnerXstateConfig = {
  id: "partner",
  initial: steps.partnerschaft.relative,
  meta: {
    done: partnerDone,
  },
  states: {
    [steps.partnerschaft.relative]: {
      on: {
        BACK: [
          {
            guard: "hasFurtherIncome",
            target: "#einkuenfte.weitere-einkuenfte.uebersicht",
          },
          "#einkuenfte.weitere-einkuenfte.frage",
        ],
        SUBMIT: [
          {
            guard: "hasPartnerschaftYes",
            target: steps.partnerZusammenleben.relative,
          },
          "#kinder",
        ],
      },
    },
    [steps.partnerZusammenleben.relative]: {
      on: {
        BACK: steps.partnerschaft.relative,
        SUBMIT: [
          {
            guard: "zusammenlebenYes",
            target: steps.partnerEinkommen.relative,
          },
          steps.partnerUnterhalt.relative,
        ],
      },
    },
    [steps.partnerUnterhalt.relative]: {
      on: {
        BACK: steps.partnerZusammenleben.relative,
        SUBMIT: [
          {
            guard: "unterhaltYes",
            target: steps.partnerUnterhaltsSumme.relative,
          },
          steps.partnerKeineRolle.relative,
        ],
      },
    },
    [steps.partnerUnterhaltsSumme.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: steps.partnerName.relative,
      },
    },
    [steps.partnerEinkommen.relative]: {
      on: {
        BACK: steps.partnerZusammenleben.relative,
        SUBMIT: [
          {
            guard: "partnerEinkommenYes",
            target: "#partner-einkuenfte",
          },
          "#kinder",
        ],
      },
    },
    [steps.partnerKeineRolle.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: "#kinder",
      },
    },
    [steps.partnerName.relative]: {
      on: {
        BACK: steps.partnerUnterhaltsSumme.relative,
        SUBMIT: "#kinder",
      },
    },

    [steps.partnerEinkuenfte.relative]: {
      id: "partner-einkuenfte",
      initial: "partner-staatliche-leistungen",
      meta: { done: einkuenfteDone },
      states: {
        [steps.partnerStaatlicheLeistungen.relative]: {
          on: {
            SUBMIT: [
              {
                guard:
                  partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
                target: "partner-buergergeld",
              },
              {
                guard:
                  partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
                target: "partner-arbeitslosengeld",
              },
              {
                guard: partnerEinkuenfteGuards.staatlicheLeistungenIsKeine,
                target: steps.partnerEinkuenfteEinkommen.relative,
              },
              "#kinder",
            ],
            BACK: steps.partnerEinkommen.absolute,
          },
        },
        "partner-buergergeld": {
          on: {
            SUBMIT: "partner-einkommen",
            BACK: "partner-staatliche-leistungen",
          },
        },
        "partner-arbeitslosengeld": {
          on: {
            SUBMIT: "partner-einkommen",
            BACK: "partner-staatliche-leistungen",
          },
        },
        [steps.partnerEinkuenfteEinkommen.relative]: {
          initial: steps.partnarErwerbstaetig.relative,
          states: {
            [steps.partnarErwerbstaetig.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.notEmployed,
                    target: steps.partnerRenteFrage.absolute,
                  },
                  steps.partnerArt.relative,
                ],
                BACK: [
                  {
                    guard:
                      partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
                    target: steps.partnerBuergergeld.absolute,
                  },
                  {
                    guard:
                      partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
                    target: steps.partnerArbeitslosengeld.absolute,
                  },
                  "#partner-einkuenfte.partner-staatliche-leistungen",
                ],
              },
            },
            [steps.partnerArt.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.isEmployee,
                    target: steps.partnerNettoEinkommen.relative,
                  },
                  steps.partnerSelbststaendig.relative,
                ],
                BACK: steps.partnarErwerbstaetig.relative,
              },
            },
            [steps.partnerNettoEinkommen.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.isSelfEmployed,
                    target: steps.partnerSelbststaendig.relative,
                  },
                  {
                    guard: ({ context }) =>
                      !partnerEinkuenfteGuards.incomeWithBuergergeld({
                        context,
                      }),
                    target: steps.partnerArbeitsweg.absolute,
                  },
                  steps.partnerRenteFrage.absolute,
                ],
                BACK: steps.partnerArt.relative,
              },
            },
            [steps.partnerSelbststaendig.relative]: {
              on: {
                SUBMIT: steps.partnerSelbststaendigAbzuege.relative,
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.isEmployee,
                    target: steps.partnerNettoEinkommen.relative,
                  },
                  steps.partnerArt.relative,
                ],
              },
            },
            [steps.partnerSelbststaendigAbzuege.relative]: {
              on: {
                BACK: steps.partnerSelbststaendig.relative,
                SUBMIT: [
                  {
                    guard: ({ context }) =>
                      !partnerEinkuenfteGuards.incomeWithBuergergeld({
                        context,
                      }),
                    target: "#partner-einkuenfte.partner-abzuege",
                  },
                  "#partner-einkuenfte.partner-rente-frage",
                ],
              },
            },
          },
        },
        [steps.partnerAbzuege.relative]: {
          initial: steps.partnerArbeitsweg.relative,
          states: {
            [steps.partnerArbeitsweg.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.usesPublicTransit,
                    target: steps.partnerOpnvKosten.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.usesPrivateVehicle,
                    target: steps.partnerArbeitsplatzEntfernung.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.commuteMethodPlaysNoRole,
                    target: steps.partnerArbeitswegKeineRolle.absolute,
                  },
                  "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben",
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.isSelfEmployed,
                    target:
                      "#partner-einkuenfte.partner-einkommen.partner-selbststaendig-abzuege",
                  },
                  "#partner-einkuenfte.partner-einkommen.partner-netto-einkommen",
                ],
              },
            },
            "partner-opnv-kosten": {
              on: {
                SUBMIT: "partner-arbeitsplatz-entfernung",
                BACK: "partner-arbeitsweg",
              },
            },
            "partner-arbeitsplatz-entfernung": {
              on: {
                SUBMIT:
                  "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben",
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.usesPublicTransit,
                    target: steps.partnerOpnvKosten.relative,
                  },
                  steps.partnerArbeitsweg.relative,
                ],
              },
            },
            "partner-keine-rolle": {
              on: {
                SUBMIT:
                  "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben",
                BACK: "partner-arbeitsweg",
              },
            },
            [steps.partnerArbeitsausgaben.relative]: {
              initial: steps.partnerArbeitsausgabenFrage.relative,
              states: {
                [steps.partnerArbeitsausgabenFrage.relative]: {
                  on: {
                    SUBMIT: [
                      {
                        guard: partnerEinkuenfteGuards.hasAndereArbeitsausgaben,
                        target: "partner-uebersicht",
                      },
                      "#partner-einkuenfte.partner-rente-frage",
                    ],
                    BACK: [
                      {
                        guard: partnerEinkuenfteGuards.usesPublicTransit,
                        target:
                          "#partner-einkuenfte.partner-abzuege.partner-arbeitsplatz-entfernung",
                      },
                      {
                        guard: partnerEinkuenfteGuards.usesPrivateVehicle,
                        target:
                          "#partner-einkuenfte.partner-abzuege.partner-arbeitsplatz-entfernung",
                      },
                      {
                        guard: partnerEinkuenfteGuards.commuteMethodPlaysNoRole,
                        target:
                          "#partner-einkuenfte.partner-abzuege.partner-keine-rolle",
                      },
                      "#partner-einkuenfte.partner-abzuege.partner-arbeitsweg",
                    ],
                  },
                },
                "partner-uebersicht": {
                  on: {
                    SUBMIT: [
                      {
                        guard:
                          partnerEinkuenfteGuards.hasAndereArbeitsausgabenAndEmptyArray,
                        target: "partner-warnung",
                      },
                      "#partner-einkuenfte.partner-rente-frage",
                    ],
                    BACK: "partner-arbeitsausgaben-frage",
                    "add-partner-arbeitsausgaben": {
                      guard:
                        partnerEinkuenfteGuards.isValidArbeitsausgabenArrayIndex,
                      target: "partner-arbeitsausgabe",
                    },
                  },
                },
                "partner-warnung": {
                  on: {
                    BACK: "partner-uebersicht",
                    SUBMIT: "#partner-einkuenfte.partner-rente-frage",
                  },
                },
                "partner-arbeitsausgabe": {
                  initial: "partner-daten",
                  states: {
                    "partner-daten": {
                      on: {
                        BACK: "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben.partner-uebersicht",
                        SUBMIT:
                          "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben.partner-uebersicht",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        [steps.partnerRenteFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: partnerEinkuenfteGuards.receivesPension,
                target: steps.partnerRente.absolute,
              },
              steps.partnerEinkuenfteUnterhaltFrage.relative,
            ],
            BACK: [
              {
                guard: partnerEinkuenfteGuards.notEmployed,
                target: "partner-einkommen",
              },
              {
                guard: ({ context }) =>
                  partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  partnerEinkuenfteGuards.isSelfEmployed({ context }),
                target:
                  "#partner-einkuenfte.partner-einkommen.partner-selbststaendig-abzuege",
              },
              {
                guard: ({ context }) =>
                  partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  !partnerEinkuenfteGuards.isSelfEmployed({ context }),
                target:
                  "#partner-einkuenfte.partner-einkommen.partner-netto-einkommen",
              },
              {
                guard: partnerEinkuenfteGuards.hasAndereArbeitsausgaben,
                target:
                  "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben.partner-uebersicht",
              },
              "#partner-einkuenfte.partner-abzuege.partner-arbeitsausgaben",
            ],
          },
        },
        [steps.partnerRente.relative]: {
          on: {
            SUBMIT: steps.partnerEinkuenfteUnterhaltFrage.relative,
            BACK: steps.partnerRenteFrage.relative,
          },
        },
        [steps.partnerEinkuenfteUnterhaltFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: partnerEinkuenfteGuards.receivesSupport,
                target: steps.partnerEinkuenfteUnterhalt.relative,
              },
              steps.partnerEinkuenfteLeistungen.relative,
            ],
            BACK: [
              {
                guard: partnerEinkuenfteGuards.receivesPension,
                target: steps.partnerRente.relative,
              },
              steps.partnerRenteFrage.relative,
            ],
          },
        },
        [steps.partnerEinkuenfteUnterhalt.relative]: {
          on: {
            SUBMIT: steps.partnerEinkuenfteLeistungen.relative,
            BACK: steps.partnerEinkuenfteUnterhaltFrage.relative,
          },
        },
        [steps.partnerEinkuenfteLeistungen.relative]: {
          initial: steps.partnerLeistungFrage.relative,
          states: {
            [steps.partnerLeistungFrage.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: steps.partnerWohngeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: steps.partnerKrankengeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: steps.partnerElterngeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target: steps.partnerKindergeld.relative,
                  },
                  "#partner-einkuenfte.partner-weitere-einkuenfte",
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.receivesSupport,
                    target: "#partner-einkuenfte.partner-unterhalt",
                  },
                  "#partner-einkuenfte.partner-unterhalt-frage",
                ],
              },
            },
            [steps.partnerWohngeld.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: steps.partnerKrankengeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: steps.partnerElterngeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-kindergeld",
                  },
                  "#partner-einkuenfte.partner-weitere-einkuenfte",
                ],
                BACK: steps.partnerLeistungFrage.relative,
              },
            },
            [steps.partnerKrankengeld.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: steps.partnerElterngeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-kindergeld",
                  },
                  "#partner-einkuenfte.partner-weitere-einkuenfte",
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: steps.partnerWohngeld.relative,
                  },
                  steps.partnerLeistungFrage.relative,
                ],
              },
            },
            [steps.partnerElterngeld.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-kindergeld",
                  },
                  "#partner-einkuenfte.partner-weitere-einkuenfte",
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: "partner-krankengeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: "partner-wohngeld",
                  },
                  steps.partnerLeistungFrage.relative,
                ],
              },
            },
            [steps.partnerKindergeld.relative]: {
              on: {
                SUBMIT: "#partner-einkuenfte.partner-weitere-einkuenfte",
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: steps.partnerElterngeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: steps.partnerKrankengeld.relative,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: steps.partnerWohngeld.relative,
                  },
                  steps.partnerLeistungFrage.relative,
                ],
              },
            },
          },
        },
        [steps.partnerWeitereEinkuenfte.relative]: {
          id: "partner-weitere-einkuenfte",
          initial: steps.partnerWeitereEinkuenfteFrage.relative,
          states: {
            [steps.partnerWeitereEinkuenfteFrage.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasFurtherIncome,
                    target: steps.partnerWeitereEinkuenfteUebersicht.relative,
                  },
                  "#partner-einkuenfte.partner-besonders-ausgaben",
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-kindergeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-elterngeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-krankengeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-wohngeld",
                  },
                  "#partner-einkuenfte.partner-leistungen",
                ],
              },
            },
            [steps.partnerWeitereEinkuenfteUebersicht.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard:
                      partnerEinkuenfteGuards.hasFurtherIncomeAndEmptyArray,
                    target: "partner-warnung",
                  },
                  "#partner-einkuenfte.partner-besonders-ausgaben",
                ],
                BACK: steps.partnerWeitereEinkuenfteFrage.relative,
                "add-partner-weitereEinkuenfte": {
                  guard: partnerEinkuenfteGuards.isValidEinkuenfteArrayIndex,
                  target: "partner-einkunft",
                },
              },
            },
            [steps.partnerWeitereEinkuenfteWarnung.relative]: {
              on: {
                BACK: "partner-uebersicht",
                SUBMIT: "#partner-einkuenfte.partner-besonders-ausgaben",
              },
            },
            "partner-einkunft": {
              initial: "partner-daten",
              states: {
                "partner-daten": {
                  on: {
                    BACK: "#partner-einkuenfte.partner-weitere-einkuenfte.partner-uebersicht",
                    SUBMIT:
                      "#partner-einkuenfte.partner-weitere-einkuenfte.partner-uebersicht",
                  },
                },
              },
            },
          },
        },
        [steps.partnerBesondersAusgaben.relative]: {
          on: {
            BACK: [
              {
                guard: partnerEinkuenfteGuards.hasFurtherIncome,
                target: "#partner-weitere-einkuenfte.partner-uebersicht",
              },
              "#partner-weitere-einkuenfte",
            ],
            SUBMIT: [
              {
                guard: "partnerHasBesondersAusgabenYes",
                target: "add-partner-besonders-ausgaben",
              },
              "#kinder",
            ],
          },
        },
        [steps.partnerAddBesondersAusgaben.relative]: {
          on: {
            SUBMIT: "#kinder",
            BACK: "partner-besonders-ausgaben",
          },
        },
      },
    },
  },
} as Flow["config"];
