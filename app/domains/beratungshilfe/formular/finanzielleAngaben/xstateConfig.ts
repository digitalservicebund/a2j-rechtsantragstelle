import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { bankKontoDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import type { Config } from "~/services/flow/server/types";
import { beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig } from "./andereUnterhaltszahlungen/xstateConfig";
import {
  ausgabenDone,
  eigentumDone,
  geldanlagenDone,
  grundeigentumDone,
  kinderDone,
  kraftfahrzeugeDone,
  wertsachenDone,
  wohnungDone,
} from "./doneFunctions";
import { beratungshilfeFinanzielleAngabenEinkommenXstateConfig } from "./einkommen/xstateConfig";
import { finanzielleAngabeGuards as guards } from "./guards";
import { berhAntragFinanzielleAngabenPages } from "./pages";
import { beratungshilfeFinanzielleAngabenPartnerXstateConfig } from "./partner/xstateConfig";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(berhAntragFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: steps.einkommen.relative,
  id: "finanzielle-angaben",
  on: {
    SUBMIT: "#persoenliche-daten.start",
    BACK: "#rechtsproblem.situation-beschreibung",
  },
  states: {
    einkommen: beratungshilfeFinanzielleAngabenEinkommenXstateConfig,
    partner: beratungshilfeFinanzielleAngabenPartnerXstateConfig,
    kinder: {
      id: "kinder",
      initial: "kinder-frage",
      meta: { done: kinderDone },
      states: {
        "kinder-frage": {
          on: {
            BACK: [
              {
                guard:
                  guards.hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
                target: "#partner.partner-name",
              },
              {
                guard: guards.hasPartnerschaftYesAndPartnerEinkommenYes,
                target: "#partner.partner-einkommen-summe",
              },
              {
                guard: guards.hasPartnerschaftYesAndZusammenlebenYes,
                target: "#partner.partner-einkommen",
              },
              {
                guard:
                  guards.hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
                target: "#partner.keine-rolle",
              },
              {
                guard: guards.hasPartnerschaftYesAndZusammenlebenNo,
                target: "#partner.unterhalt",
              },
              {
                guard: guards.hasPartnerschaftYes,
                target: "#partner.zusammenleben",
              },
              "#partner.partnerschaft",
            ],
            SUBMIT: [
              {
                guard: guards.hasKinderYes,
                target: "uebersicht",
              },
              "#andere-unterhaltszahlungen.frage",
            ],
          },
        },
        uebersicht: {
          on: {
            BACK: "kinder-frage",
            SUBMIT: [
              {
                guard: guards.hasKinderYesAndEmptyArray,
                target: "warnung",
              },
              "#andere-unterhaltszahlungen",
            ],
            "add-kinder": {
              guard: guards.isValidKinderArrayIndex,
              target: "kinder",
            },
          },
        },
        warnung: {
          on: {
            BACK: "uebersicht",
            SUBMIT: "#andere-unterhaltszahlungen",
          },
        },
        kinder: {
          initial: "name",
          states: {
            name: {
              on: {
                BACK: "#kinder.uebersicht",
                SUBMIT: "wohnort",
              },
            },
            wohnort: {
              on: {
                BACK: "name",
                SUBMIT: [
                  {
                    guard: guards.kindWohnortBeiAntragstellerYes,
                    target: "kind-eigene-einnahmen-frage",
                  },
                  {
                    guard: guards.kindWohnortBeiAntragstellerNo,
                    target: "kind-unterhalt-frage",
                  },
                ],
              },
            },
            "kind-eigene-einnahmen-frage": {
              on: {
                BACK: "wohnort",
                SUBMIT: [
                  {
                    guard: guards.kindEigeneEinnahmenYes,
                    target: "kind-eigene-einnahmen",
                  },
                  "#kinder.uebersicht",
                ],
              },
            },
            "kind-eigene-einnahmen": {
              on: {
                BACK: "kind-eigene-einnahmen-frage",
                SUBMIT: "#kinder.uebersicht",
              },
            },
            "kind-unterhalt-frage": {
              on: {
                BACK: "wohnort",
                SUBMIT: [
                  {
                    guard: guards.kindUnterhaltYes,
                    target: "kind-unterhalt",
                  },
                  {
                    guard: guards.kindUnterhaltNo,
                    target: "kind-unterhalt-ende",
                  },
                ],
              },
            },
            "kind-unterhalt": {
              on: {
                BACK: "kind-unterhalt-frage",
                SUBMIT: "#kinder.uebersicht",
              },
            },
            "kind-unterhalt-ende": {
              on: {
                BACK: "kind-unterhalt-frage",
                SUBMIT: "#kinder.uebersicht",
              },
            },
          },
        },
      },
    },
    "andere-unterhaltszahlungen":
      beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig,
    wohnung: {
      id: "wohnung",
      initial: "wohnsituation",
      meta: { done: wohnungDone },
      on: {
        SUBMIT: "#eigentum",
      },
      states: {
        wohnsituation: {
          on: {
            BACK: [
              {
                guard: guards.hasWeitereUnterhaltszahlungenYes,
                target: "#andere-unterhaltszahlungen.uebersicht",
              },
              "#andere-unterhaltszahlungen.frage",
            ],
            SUBMIT: "groesse",
          },
        },
        groesse: {
          on: {
            BACK: "wohnsituation",
            SUBMIT: [
              {
                target: "wohnkosten-allein",
                guard: guards.livesAlone,
              },
              {
                target: "personen-anzahl",
                guard: guards.livesNotAlone,
              },
            ],
          },
        },
        "wohnkosten-allein": {
          on: {
            BACK: "groesse",
            SUBMIT: "#eigentum",
          },
        },
        "personen-anzahl": {
          on: {
            BACK: "groesse",
            SUBMIT: "wohnkosten-geteilt",
          },
        },
        "wohnkosten-geteilt": {
          on: {
            BACK: "personen-anzahl",
            SUBMIT: "#eigentum",
          },
        },
      },
    },
    eigentum: {
      id: "eigentum",
      initial: "eigentum-info",
      meta: { done: eigentumDone },
      states: {
        "eigentum-info": {
          on: {
            SUBMIT: [
              {
                guard: guards.hasPartnerschaftYesAndNoStaatlicheLeistungen,
                target: "heirat-info",
              },
              "bankkonten",
            ],
            BACK: [
              {
                guard: guards.staatlicheLeistungenIsBuergergeld,
                target: "#einkommen.staatliche-leistungen",
              },
              {
                guard: guards.livesAlone,
                target: "#finanzielle-angaben.wohnung.wohnkosten-allein",
              },
              {
                guard: guards.livesNotAlone,
                target: "#finanzielle-angaben.wohnung.wohnkosten-geteilt",
              },
              "#finanzielle-angaben.wohnung.groesse",
            ],
          },
        },
        "heirat-info": {
          on: {
            BACK: "eigentum-info",
            SUBMIT: "bankkonten",
          },
        },
        bankkonten: {
          initial: "bankkonten-frage",
          states: {
            "bankkonten-frage": {
              on: {
                BACK: [
                  {
                    guard: guards.hasPartnerschaftYesAndNoStaatlicheLeistungen,
                    target: "#eigentum.heirat-info",
                  },
                  "#eigentum.eigentum-info",
                ],
                SUBMIT: [
                  {
                    guard: guards.hasBankkontoYes,
                    target: "uebersicht",
                  },
                  "#eigentum.geldanlagen",
                ],
              },
            },
            uebersicht: {
              on: {
                BACK: "bankkonten-frage",
                SUBMIT: [
                  {
                    guard: ({ context }) => !bankKontoDone({ context }),
                    target: "warnung",
                  },
                  "#eigentum.geldanlagen",
                ],
                "add-bankkonten": "bankkonto.daten",
              },
            },
            warnung: {
              on: {
                BACK: "uebersicht",
                SUBMIT: "#eigentum.geldanlagen",
              },
            },
            bankkonto: {
              initial: "daten",
              states: {
                daten: {
                  on: {
                    BACK: "#eigentum.bankkonten.uebersicht",
                    SUBMIT: "#eigentum.bankkonten.uebersicht",
                  },
                },
              },
            },
          },
        },
        geldanlagen: {
          initial: "geldanlagen-frage",
          states: {
            "geldanlagen-frage": {
              on: {
                BACK: [
                  {
                    guard: guards.hasBankkontoYes,
                    target: "#eigentum.bankkonten.uebersicht",
                  },
                  "#eigentum.bankkonten",
                ],
                SUBMIT: [
                  {
                    guard: guards.hasGeldanlageYes,
                    target: "uebersicht",
                  },
                  "#eigentum.kraftfahrzeuge",
                ],
              },
            },
            uebersicht: {
              on: {
                BACK: "geldanlagen-frage",
                SUBMIT: [
                  {
                    guard: ({ context }) => !geldanlagenDone({ context }),
                    target: "warnung",
                  },
                  "#eigentum.kraftfahrzeuge",
                ],
                "add-geldanlagen": "geldanlage.art",
              },
            },
            warnung: {
              on: {
                BACK: "uebersicht",
                SUBMIT: "#eigentum.kraftfahrzeuge",
              },
            },
            geldanlage: {
              initial: "art",
              states: {
                art: {
                  on: {
                    SUBMIT: [
                      {
                        target: "bargeld",
                        guard: guards.isGeldanlageBargeld,
                      },
                      {
                        target: "wertpapiere",
                        guard: guards.isGeldanlageWertpapiere,
                      },
                      {
                        target: "guthabenkonto-krypto",
                        guard: guards.isGeldanlageGuthabenkontoKrypto,
                      },
                      {
                        target: "giro-tagesgeld-sparkonto",
                        guard: guards.isGeldanlageGiroTagesgeldSparkonto,
                      },
                      {
                        target: "befristet",
                        guard: guards.isGeldanlageBefristet,
                      },
                      {
                        target: "forderung",
                        guard: guards.isGeldanlageForderung,
                      },
                      {
                        target: "sonstiges",
                        guard: guards.isGeldanlageSonstiges,
                      },
                    ],
                    BACK: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                bargeld: {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                wertpapiere: {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                "guthabenkonto-krypto": {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                "giro-tagesgeld-sparkonto": {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                befristet: {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                forderung: {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
                sonstiges: {
                  on: {
                    BACK: "art",
                    SUBMIT: "#eigentum.geldanlagen.uebersicht",
                  },
                },
              },
            },
          },
        },
        kraftfahrzeuge: {
          initial: "kraftfahrzeuge-frage",
          states: {
            "kraftfahrzeuge-frage": {
              on: {
                BACK: [
                  {
                    guard: guards.hasGeldanlageYes,
                    target: "#eigentum.geldanlagen.uebersicht",
                  },
                  "#eigentum.geldanlagen",
                ],
                SUBMIT: [
                  {
                    guard: guards.hasKraftfahrzeugYes,
                    target: "uebersicht",
                  },
                  "#eigentum.wertgegenstaende",
                ],
              },
            },
            uebersicht: {
              on: {
                BACK: "kraftfahrzeuge-frage",
                SUBMIT: [
                  {
                    guard: ({ context }) => !kraftfahrzeugeDone({ context }),
                    target: "warnung",
                  },
                  "#eigentum.wertgegenstaende",
                ],
                "add-kraftfahrzeuge": "kraftfahrzeug",
              },
            },
            warnung: {
              on: {
                BACK: "uebersicht",
                SUBMIT: "#eigentum.wertgegenstaende",
              },
            },
            kraftfahrzeug: {
              initial: "arbeitsweg",
              states: {
                arbeitsweg: {
                  on: {
                    BACK: "#eigentum.kraftfahrzeuge.uebersicht",
                    SUBMIT: "wert",
                  },
                },
                wert: {
                  on: {
                    BACK: "arbeitsweg",
                    SUBMIT: [
                      {
                        guard: guards.isKraftfahrzeugWertAbove10000OrUnsure,
                        target: "fahrzeuge",
                      },
                      "#eigentum.kraftfahrzeuge.uebersicht",
                    ],
                  },
                },
                fahrzeuge: {
                  on: {
                    BACK: "wert",
                    SUBMIT: "#eigentum.kraftfahrzeuge.uebersicht",
                  },
                },
              },
            },
          },
        },
        wertgegenstaende: {
          initial: "wertgegenstaende-frage",
          states: {
            "wertgegenstaende-frage": {
              on: {
                BACK: [
                  {
                    guard: guards.hasKraftfahrzeugYes,
                    target: "#eigentum.kraftfahrzeuge.uebersicht",
                  },
                  "#eigentum.kraftfahrzeuge",
                ],
                SUBMIT: [
                  {
                    guard: guards.hasWertsacheYes,
                    target: "uebersicht",
                  },
                  "#eigentum.grundeigentum.grundeigentum-frage",
                ],
              },
            },
            uebersicht: {
              on: {
                BACK: "wertgegenstaende-frage",
                SUBMIT: [
                  {
                    guard: ({ context }) => !wertsachenDone({ context }),
                    target: "warnung",
                  },
                  "#eigentum.grundeigentum.grundeigentum-frage",
                ],
                "add-wertsachen": "wertgegenstand",
              },
            },
            warnung: {
              on: {
                BACK: "uebersicht",
                SUBMIT: "#eigentum.grundeigentum.grundeigentum-frage",
              },
            },
            wertgegenstand: {
              initial: "daten",
              states: {
                daten: {
                  on: {
                    BACK: "#eigentum.wertgegenstaende.uebersicht",
                    SUBMIT: "#eigentum.wertgegenstaende.uebersicht",
                  },
                },
              },
            },
          },
        },
        grundeigentum: {
          initial: "grundeigentum-frage",
          states: {
            "grundeigentum-frage": {
              on: {
                BACK: [
                  {
                    guard: guards.hasWertsacheYes,
                    target: "#eigentum.wertgegenstaende.uebersicht",
                  },
                  "#eigentum.wertgegenstaende",
                ],
                SUBMIT: [
                  {
                    guard: guards.hasGrundeigentumYes,
                    target: "uebersicht",
                  },
                  {
                    guard: guards.staatlicheLeistungenIsBuergergeld,
                    target: "#persoenliche-daten.start",
                  },
                  "#ausgaben",
                ],
              },
            },
            uebersicht: {
              on: {
                BACK: "grundeigentum-frage",
                SUBMIT: [
                  {
                    guard: ({ context }) => !grundeigentumDone({ context }),
                    target: "warnung",
                  },
                  {
                    guard: guards.staatlicheLeistungenIsBuergergeld,
                    target: "#persoenliche-daten.start",
                  },
                  "#ausgaben",
                ],
                "add-grundeigentum": "grundeigentum",
              },
            },
            warnung: {
              on: {
                BACK: "uebersicht",
                SUBMIT: [
                  {
                    guard: guards.staatlicheLeistungenIsBuergergeld,
                    target: "#persoenliche-daten.start",
                  },
                  "#ausgaben",
                ],
              },
            },
            grundeigentum: {
              initial: "bewohnt-frage",
              states: {
                "bewohnt-frage": {
                  on: {
                    BACK: "#eigentum.grundeigentum.uebersicht",
                    SUBMIT: [
                      {
                        guard: guards.grundeigentumIsBewohnt,
                        target: "bewohnt-daten",
                      },
                      "daten",
                    ],
                  },
                },
                "bewohnt-daten": {
                  on: {
                    BACK: "bewohnt-frage",
                    SUBMIT: "#eigentum.grundeigentum.uebersicht",
                  },
                },
                daten: {
                  on: {
                    BACK: "bewohnt-frage",
                    SUBMIT: "#eigentum.grundeigentum.uebersicht",
                  },
                },
              },
            },
          },
        },
      },
    },
    ausgaben: {
      id: "ausgaben",
      initial: "ausgaben-frage",
      meta: { done: ausgabenDone },
      states: {
        "ausgaben-frage": {
          on: {
            BACK: [
              {
                guard: guards.hasGrundeigentumYes,
                target: "#eigentum.grundeigentum.uebersicht",
              },
              "#eigentum.grundeigentum",
            ],
            SUBMIT: [
              {
                guard: guards.hasAusgabenYes,
                target: "situation",
              },
              "#persoenliche-daten.start",
            ],
          },
        },
        situation: {
          on: {
            BACK: "ausgaben-frage",
            SUBMIT: "uebersicht",
          },
        },
        uebersicht: {
          on: {
            BACK: "situation",
            SUBMIT: [
              {
                guard: guards.hasAusgabenYesAndEmptyArray,
                target: "warnung",
              },
              "#persoenliche-daten.start",
            ],
            "add-ausgaben": {
              guard: guards.isValidAusgabenArrayIndex,
              target: "ausgaben",
            },
          },
        },
        warnung: {
          on: {
            BACK: "uebersicht",
            SUBMIT: "#persoenliche-daten",
          },
        },
        ausgaben: {
          initial: "art",
          states: {
            art: {
              on: {
                BACK: "#ausgaben.uebersicht",
                SUBMIT: "zahlungsinformation",
              },
            },
            zahlungsinformation: {
              on: {
                BACK: "art",
                SUBMIT: "laufzeit",
              },
            },
            laufzeit: {
              on: {
                BACK: "zahlungsinformation",
                SUBMIT: [
                  {
                    guard: guards.hasZahlungsfristYes,
                    target: "zahlungsfrist",
                  },
                  "#ausgaben.uebersicht",
                ],
              },
            },
            zahlungsfrist: {
              on: {
                BACK: "laufzeit",
                SUBMIT: "#ausgaben.uebersicht",
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenUserData>;
