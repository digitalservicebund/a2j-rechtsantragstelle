import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import {
  finanzielleAngabeEinkuenfteGuards,
  partnerEinkuenfteGuards,
} from "../einkuenfte/guards";
import type { PartnerEinkuenfteUserData } from "./userData";
import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData } from "../abzuege/userData";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData } from "../einkuenfte/userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenPartnerPages,
);

export const partnerXstateConfig = {
  id: "partner",
  initial: steps.partnerschaft.relative,
  meta: {
    shouldAppearAsMenuNavigation: true,
  },
  states: {
    [steps.partnerschaft.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              finanzielleAngabeEinkuenfteGuards.incomeWithNoBuergergeld({
                context,
              }) && !context.arbeitsweg,
            target: "#finanzielle-angaben.abzuege.arbeitsweg",
          },
          {
            guard: ({ context }) => context.hasArbeitsausgaben === "yes",
            target: "#finanzielle-angaben.abzuege.arbeitsausgaben.uebersicht",
          },
          {
            guard: finanzielleAngabeEinkuenfteGuards.incomeWithNoBuergergeld,
            target: "#finanzielle-angaben.abzuege.arbeitsausgaben",
          },
          {
            guard: finanzielleAngabeEinkuenfteGuards.hasFurtherIncome,
            target: "#einkuenfte.weitere-einkuenfte.uebersicht",
          },
          {
            guard: ({ context }) => !context.currentlyEmployed,
            target: "#einkuenfte.einkommen",
          },
          "#einkuenfte.weitere-einkuenfte.frage",
        ],
        SUBMIT: [
          {
            guard: ({ context }) => context.partnerschaft === "yes",
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
            guard: ({ context }) => context.zusammenleben === "yes",
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
            guard: ({ context }) => context.unterhalt === "yes",
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
            guard: ({ context }) => context.partnerEinkommen == "yes",
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
      initial: steps.partnerStaatlicheLeistungen.relative,
      states: {
        [steps.partnerStaatlicheLeistungen.relative]: {
          on: {
            SUBMIT: [
              {
                guard:
                  partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld,
                target: steps.partnerBuergergeld.relative,
              },
              {
                guard:
                  partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld,
                target: steps.partnerArbeitslosengeld.relative,
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
        [steps.partnerBuergergeld.relative]: {
          on: {
            SUBMIT: steps.partnerEinkommen.relative,
            BACK: steps.partnerStaatlicheLeistungen.relative,
          },
        },
        [steps.partnerArbeitslosengeld.relative]: {
          on: {
            SUBMIT: steps.partnerEinkommen.relative,
            BACK: steps.partnerStaatlicheLeistungen.relative,
          },
        },
        [steps.partnerEinkuenfteEinkommen.relative]: {
          initial: steps.partnerErwerbstaetig.relative,
          states: {
            [steps.partnerErwerbstaetig.relative]: {
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
                  steps.partnerStaatlicheLeistungen.absolute,
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
                BACK: steps.partnerErwerbstaetig.relative,
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
                    target: steps.partnerAbzuege.absolute,
                  },
                  steps.partnerRenteFrage.absolute,
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
                  steps.partnerArbeitsausgaben.absolute,
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.isSelfEmployed,
                    target: steps.partnerSelbststaendigAbzuege.absolute,
                  },
                  steps.partnerNettoEinkommen.absolute,
                ],
              },
            },
            [steps.partnerOpnvKosten.relative]: {
              on: {
                SUBMIT: steps.partnerArbeitsplatzEntfernung.relative,
                BACK: steps.partnerArbeitsweg.relative,
              },
            },
            [steps.partnerArbeitsplatzEntfernung.relative]: {
              on: {
                SUBMIT: steps.partnerArbeitsausgaben.absolute,
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.usesPublicTransit,
                    target: steps.partnerOpnvKosten.relative,
                  },
                  steps.partnerArbeitsweg.relative,
                ],
              },
            },
            [steps.partnerArbeitswegKeineRolle.relative]: {
              on: {
                SUBMIT: steps.partnerArbeitsausgaben.absolute,
                BACK: steps.partnerArbeitsweg.relative,
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
                        target: steps.partnerArbeitsausgabenUebersicht.relative,
                      },
                      steps.partnerRenteFrage.absolute,
                    ],
                    BACK: [
                      {
                        guard: partnerEinkuenfteGuards.usesPublicTransit,
                        target: steps.partnerArbeitsplatzEntfernung.absolute,
                      },
                      {
                        guard: partnerEinkuenfteGuards.usesPrivateVehicle,
                        target: steps.partnerArbeitsplatzEntfernung.absolute,
                      },
                      {
                        guard: partnerEinkuenfteGuards.commuteMethodPlaysNoRole,
                        target: steps.partnerArbeitswegKeineRolle.absolute,
                      },
                      steps.partnerArbeitsweg.absolute,
                    ],
                  },
                },
                [steps.partnerArbeitsausgabenUebersicht.relative]: {
                  on: {
                    SUBMIT: [
                      {
                        guard:
                          partnerEinkuenfteGuards.hasAndereArbeitsausgabenAndEmptyArray,
                        target: steps.partnerArbeitsausgabenWarnung.relative,
                      },
                      steps.partnerRenteFrage.absolute,
                    ],
                    BACK: steps.partnerArbeitsausgabenFrage.relative,
                    "add-partner-arbeitsausgaben": {
                      guard:
                        partnerEinkuenfteGuards.isValidArbeitsausgabenArrayIndex,
                      target: steps.partnerArbeitsausgabe.relative,
                    },
                  },
                },
                [steps.partnerArbeitsausgabenWarnung.relative]: {
                  on: {
                    BACK: steps.partnerArbeitsausgabenUebersicht.relative,
                    SUBMIT: steps.partnerRenteFrage.absolute,
                  },
                },
                [steps.partnerArbeitsausgabe.relative]: {
                  initial: "partner-daten",
                  states: {
                    "partner-daten": {
                      on: {
                        BACK: steps.partnerArbeitsausgabenUebersicht.absolute,
                        SUBMIT: steps.partnerArbeitsausgabenUebersicht.absolute,
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
                target: steps.partnerEinkommen.relative,
              },
              {
                guard: ({ context }) =>
                  partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  partnerEinkuenfteGuards.isSelfEmployed({ context }),
                target: steps.partnerSelbststaendigAbzuege.absolute,
              },
              {
                guard: ({ context }) =>
                  partnerEinkuenfteGuards.incomeWithBuergergeld({ context }) &&
                  !partnerEinkuenfteGuards.isSelfEmployed({ context }),
                target: steps.partnerNettoEinkommen.absolute,
              },
              {
                guard: partnerEinkuenfteGuards.hasAndereArbeitsausgaben,
                target: steps.partnerArbeitsausgabenUebersicht.absolute,
              },
              steps.partnerArbeitsausgaben.absolute,
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
                  steps.partnerWeitereEinkuenfte.absolute,
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.receivesSupport,
                    target: steps.partnerEinkuenfteUnterhalt.absolute,
                  },
                  steps.partnerEinkuenfteUnterhaltFrage.absolute,
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
                    target: steps.partnerKindergeld.absolute,
                  },
                  steps.partnerWeitereEinkuenfte.absolute,
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
                    target: steps.partnerKindergeld.absolute,
                  },
                  steps.partnerWeitereEinkuenfte.absolute,
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
                    target: steps.partnerKindergeld.absolute,
                  },
                  steps.partnerWeitereEinkuenfte.absolute,
                ],
                BACK: [
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
            [steps.partnerKindergeld.relative]: {
              on: {
                SUBMIT: steps.partnerWeitereEinkuenfte.absolute,
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
                  steps.partnerBesondersAusgaben.absolute,
                ],
                BACK: [
                  {
                    guard: partnerEinkuenfteGuards.hasKindergeld,
                    target: steps.partnerKindergeld.absolute,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasElterngeld,
                    target: steps.partnerElterngeld.absolute,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasKrankengeld,
                    target: steps.partnerKrankengeld.absolute,
                  },
                  {
                    guard: partnerEinkuenfteGuards.hasWohngeld,
                    target: steps.partnerWohngeld.absolute,
                  },
                  steps.partnerEinkuenfteLeistungen.absolute,
                ],
              },
            },
            [steps.partnerWeitereEinkuenfteUebersicht.relative]: {
              on: {
                SUBMIT: [
                  {
                    guard:
                      partnerEinkuenfteGuards.hasFurtherIncomeAndEmptyArray,
                    target: steps.partnerWeitereEinkuenfteWarnung.relative,
                  },
                  steps.partnerBesondersAusgaben.absolute,
                ],
                BACK: steps.partnerWeitereEinkuenfteFrage.relative,
                "add-partner-weitereEinkuenfte": {
                  guard: partnerEinkuenfteGuards.isValidEinkuenfteArrayIndex,
                  target: steps.partnerWeitereEinkunft.relative,
                },
              },
            },
            [steps.partnerWeitereEinkuenfteWarnung.relative]: {
              on: {
                BACK: steps.partnerWeitereEinkuenfteUebersicht.relative,
                SUBMIT: steps.partnerBesondersAusgaben.absolute,
              },
            },
            [steps.partnerWeitereEinkunft.relative]: {
              initial: "partner-daten",
              states: {
                "partner-daten": {
                  on: {
                    BACK: steps.partnerWeitereEinkuenfteUebersicht.absolute,
                    SUBMIT: steps.partnerWeitereEinkuenfteUebersicht.absolute,
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
                target: steps.partnerWeitereEinkuenfteUebersicht.absolute,
              },
              steps.partnerWeitereEinkuenfte.absolute,
            ],
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.partnerHasBesondersAusgaben === "yes",
                target: steps.partnerAddBesondersAusgaben.relative,
              },
              "#kinder",
            ],
          },
        },
        [steps.partnerAddBesondersAusgaben.relative]: {
          on: {
            SUBMIT: "#kinder",
            BACK: steps.partnerBesondersAusgaben.relative,
          },
        },
      },
    },
  },
} satisfies Config<
  PartnerEinkuenfteUserData &
    ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData &
    ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData
>;
