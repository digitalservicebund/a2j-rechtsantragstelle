import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { bankKontoDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { type Config } from "~/services/flow/server/types";
import { berhAntragFinanzielleAngabenEigentumPages } from "./pages";
import {
  eigentumDone,
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "../doneFunctions";
import {
  finanzielleAngabeGuards,
  grundeigentumIsBewohnt,
  hasGrundeigentumYes,
  hasKraftfahrzeugYes,
  hasWertsacheYes,
  isGeldanlageBargeld,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageSonstiges,
  isGeldanlageWertpapiere,
  isKraftfahrzeugWertAbove10000OrUnsure,
  staatlicheLeistungenIsBuergergeld,
} from "../guards";
import { type BeratungshilfeFinanzielleAngabenEigentumUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenEigentumPages,
);

export const berhAntragFinanzielleAngabenEigentumXstateConfig = {
  id: "eigentum",
  initial: steps.eigentumInfo.relative,
  meta: { done: eigentumDone },
  states: {
    [steps.eigentumInfo.relative]: {
      on: {
        SUBMIT: [
          {
            guard:
              finanzielleAngabeGuards.hasPartnerschaftYesAndNoStaatlicheLeistungen,
            target: steps.eigentumHeiratInfo.relative,
          },
          "bankkonten",
        ],
        BACK: [
          {
            guard: staatlicheLeistungenIsBuergergeld,
            target: "#einkommen.staatliche-leistungen",
          },
          {
            guard: finanzielleAngabeGuards.livesAlone,
            target: "#finanzielle-angaben.wohnung.wohnkosten-allein",
          },
          {
            guard: finanzielleAngabeGuards.livesNotAlone,
            target: "#finanzielle-angaben.wohnung.wohnkosten-geteilt",
          },
          "#finanzielle-angaben.wohnung.groesse",
        ],
      },
    },
    [steps.eigentumHeiratInfo.relative]: {
      on: {
        BACK: steps.eigentumInfo.relative,
        SUBMIT: steps.eigentumBankkonten.relative,
      },
    },
    [steps.eigentumBankkonten.relative]: {
      initial: steps.eigentumBankkontenFrage.relative,
      states: {
        [steps.eigentumBankkontenFrage.relative]: {
          on: {
            BACK: [
              {
                guard:
                  finanzielleAngabeGuards.hasPartnerschaftYesAndNoStaatlicheLeistungen,
                target: "#eigentum.heirat-info",
              },
              "#eigentum.eigentum-info",
            ],
            SUBMIT: [
              {
                guard: ({ context }) => context.hasBankkonto === "yes",
                target: steps.eigentumBankkontenUebersicht.relative,
              },
              "#eigentum.geldanlagen",
            ],
          },
        },
        [steps.eigentumBankkontenUebersicht.relative]: {
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
        [steps.eigentumBankkontoWarnung.relative]: {
          on: {
            BACK: steps.eigentumBankkontenUebersicht.relative,
            SUBMIT: "#eigentum.geldanlagen",
          },
        },
        [steps.eigentumBankkonto.relative]: {
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
    [steps.eigentumGeldanlagen.relative]: {
      initial: steps.eigentumGeldanlagenFrage.relative,
      states: {
        [steps.eigentumGeldanlagenFrage.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) => context.hasBankkonto === "yes",
                target: "#eigentum.bankkonten.uebersicht",
              },
              "#eigentum.bankkonten",
            ],
            SUBMIT: [
              {
                guard: ({ context }) => context.hasGeldanlage === "yes",
                target: "uebersicht",
              },
              "#eigentum.kraftfahrzeuge",
            ],
          },
        },
        [steps.eigentumGeldanlagenUebersicht.relative]: {
          on: {
            BACK: steps.eigentumGeldanlagenFrage.relative,
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
        [steps.eigentumGeldanlagenWarnung.relative]: {
          on: {
            BACK: steps.eigentumGeldanlagenUebersicht.relative,
            SUBMIT: "#eigentum.kraftfahrzeuge",
          },
        },
        [steps.eigentumGeldanlage.relative]: {
          initial: "art",
          states: {
            art: {
              on: {
                SUBMIT: [
                  {
                    target: "bargeld",
                    guard: isGeldanlageBargeld,
                  },
                  {
                    target: "wertpapiere",
                    guard: isGeldanlageWertpapiere,
                  },
                  {
                    target: "guthabenkonto-krypto",
                    guard: isGeldanlageGuthabenkontoKrypto,
                  },
                  {
                    target: "giro-tagesgeld-sparkonto",
                    guard: isGeldanlageGiroTagesgeldSparkonto,
                  },
                  {
                    target: "befristet",
                    guard: isGeldanlageBefristet,
                  },
                  {
                    target: "forderung",
                    guard: isGeldanlageForderung,
                  },
                  {
                    target: "sonstiges",
                    guard: isGeldanlageSonstiges,
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
    [steps.eigentumKraftfahrzeuge.relative]: {
      initial: steps.eigentumKraftfahrzeugeFrage.relative,
      states: {
        [steps.eigentumKraftfahrzeugeFrage.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) => context.hasGeldanlage === "yes",
                target: "#eigentum.geldanlagen.uebersicht",
              },
              "#eigentum.geldanlagen",
            ],
            SUBMIT: [
              {
                guard: hasKraftfahrzeugYes,
                target: steps.eigentumKraftfahrzeugeUebersicht.relative,
              },
              "#eigentum.wertgegenstaende",
            ],
          },
        },
        [steps.eigentumKraftfahrzeugeUebersicht.relative]: {
          on: {
            BACK: steps.eigentumKraftfahrzeugeFrage.relative,
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
        [steps.eigentumKraftfahrzeugeWarnung.relative]: {
          on: {
            BACK: steps.eigentumKraftfahrzeugeUebersicht.relative,
            SUBMIT: "#eigentum.wertgegenstaende",
          },
        },
        [steps.eigentumKraftfahrzeug.relative]: {
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
                    guard: isKraftfahrzeugWertAbove10000OrUnsure,
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
    [steps.eigentumWertgegenstaende.relative]: {
      initial: steps.eigentumWertgegenstaendeFrage.relative,
      states: {
        [steps.eigentumWertgegenstaendeFrage.relative]: {
          on: {
            BACK: [
              {
                guard: hasKraftfahrzeugYes,
                target: "#eigentum.kraftfahrzeuge.uebersicht",
              },
              "#eigentum.kraftfahrzeuge",
            ],
            SUBMIT: [
              {
                guard: hasWertsacheYes,
                target: steps.eigentumWertgegenstaendeUebersicht.relative,
              },
              "#eigentum.grundeigentum.grundeigentum-frage",
            ],
          },
        },
        [steps.eigentumWertgegenstaendeUebersicht.relative]: {
          on: {
            BACK: steps.eigentumWertgegenstaendeFrage.relative,
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
        [steps.eigentumWertgegenstaendeWarnung.relative]: {
          on: {
            BACK: steps.eigentumWertgegenstaendeUebersicht.relative,
            SUBMIT: "#eigentum.grundeigentum.grundeigentum-frage",
          },
        },
        [steps.eigentumWertgegenstand.relative]: {
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
    [steps.eigentumGrundeigentum.relative]: {
      initial: steps.eigentumGrundeigentumFrage.relative,
      states: {
        [steps.eigentumGrundeigentumFrage.relative]: {
          on: {
            BACK: [
              {
                guard: hasWertsacheYes,
                target: "#eigentum.wertgegenstaende.uebersicht",
              },
              "#eigentum.wertgegenstaende",
            ],
            SUBMIT: [
              {
                guard: hasGrundeigentumYes,
                target: steps.eigentumGrundeigentumUebersicht.relative,
              },
              {
                guard: staatlicheLeistungenIsBuergergeld,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben",
            ],
          },
        },
        [steps.eigentumGrundeigentumUebersicht.relative]: {
          on: {
            BACK: steps.eigentumGrundeigentumFrage.relative,
            SUBMIT: [
              {
                guard: ({ context }) => !grundeigentumDone({ context }),
                target: steps.eigentumGrundeigentumWarnung.relative,
              },
              {
                guard: staatlicheLeistungenIsBuergergeld,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben",
            ],
            "add-grundeigentum": "grundeigentum",
          },
        },
        [steps.eigentumGrundeigentumWarnung.relative]: {
          on: {
            BACK: steps.eigentumGrundeigentumUebersicht.relative,
            SUBMIT: [
              {
                guard: staatlicheLeistungenIsBuergergeld,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben",
            ],
          },
        },
        [steps.eigentumGrundeigentumGrundeigentum.relative]: {
          initial: "bewohnt-frage",
          states: {
            "bewohnt-frage": {
              on: {
                BACK: "#eigentum.grundeigentum.uebersicht",
                SUBMIT: [
                  {
                    guard: grundeigentumIsBewohnt,
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
} satisfies Config<BeratungshilfeFinanzielleAngabenEigentumUserData>;
