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
    [steps.partnerKeineRolle.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: "#kinder",
      },
    },
    [steps.partnerUnterhaltsSumme.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: steps.partnerName.relative,
      },
    },
    [steps.partnerName.relative]: {
      on: {
        BACK: steps.partnerUnterhaltsSumme.relative,
        SUBMIT: "#kinder",
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
    "partner-einkuenfte": {
      id: "partner-einkuenfte",
      initial: "partner-staatliche-leistungen",
      meta: { done: einkuenfteDone },
      states: {
        "partner-staatliche-leistungen": {
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
                target: "partner-einkommen",
              },
              "#kinder",
            ],
            BACK: steps.partnerEinkommen.relative,
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
        "partner-einkommen": {
          initial: "partner-erwerbstaetig",
          states: {
            "partner-erwerbstaetig": {
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
            "partner-art": {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.isEmployee,
                    target: steps.partnerNettoEinkommen.relative,
                  },
                  steps.partnerSelbststaendig.relative,
                ],
                BACK: "partner-erwerbstaetig",
              },
            },
            "partner-netto-einkommen": {
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
                    target: steps.partnerArbeitsausgaben.absolute,
                  },
                  steps.partnerRenteFrage.absolute,
                ],
                BACK: steps.partnerArt.relative,
              },
            },
            "partner-selbststaendig": {
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
            "partner-selbststaendig-abzuege": {
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
        "partner-abzuege": {
          initial: "partner-arbeitsweg",
          states: {
            "partner-arbeitsweg": {
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
        "partner-rente-frage": {
          on: {
            SUBMIT: [
              {
                guard: partnerEinkuenfteGuards.receivesPension,
                target: "partner-rente",
              },
              "partner-unterhalt-frage",
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
        "partner-rente": {
          on: {
            SUBMIT: "partner-unterhalt-frage",
            BACK: "partner-rente-frage",
          },
        },
        "partner-unterhalt-frage": {
          on: {
            SUBMIT: [
              {
                guard: partnerEinkuenfteGuards.receivesSupport,
                target: "partner-unterhalt",
              },
              "partner-leistungen",
            ],
            BACK: [
              {
                guard: partnerEinkuenfteGuards.receivesPension,
                target: "partner-rente",
              },
              "partner-rente-frage",
            ],
          },
        },
        "partner-unterhalt": {
          on: {
            SUBMIT: "partner-leistungen",
            BACK: "partner-unterhalt-frage",
          },
        },
        "partner-leistungen": {
          initial: "partner-frage",
          states: {
            "partner-frage": {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: "partner-wohngeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: "partner-krankengeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: "partner-elterngeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target: "partner-kindergeld",
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
            "partner-wohngeld": {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: "partner-krankengeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: "partner-elterngeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target:
                      "#partner-einkuenfte.partner-leistungen.partner-kindergeld",
                  },
                  "#partner-einkuenfte.partner-weitere-einkuenfte",
                ],
                BACK: "partner-frage",
              },
            },
            "partner-krankengeld": {
              on: {
                SUBMIT: [
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: "partner-elterngeld",
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
                    target: "partner-wohngeld",
                  },
                  "partner-frage",
                ],
              },
            },
            "partner-elterngeld": {
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
                  "partner-frage",
                ],
              },
            },
            "partner-kindergeld": {
              on: {
                SUBMIT: "#partner-einkuenfte.partner-weitere-einkuenfte",
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: "partner-elterngeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: "partner-krankengeld",
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: "partner-wohngeld",
                  },
                  "partner-frage",
                ],
              },
            },
          },
        },
        "partner-weitere-einkuenfte": {
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
            "partner-uebersicht": {
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
            "partner-warnung": {
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
