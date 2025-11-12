import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenEigentumPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/eigentum/pages";
import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";
import { eigentumDone } from "./doneFunctions";
import {
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
} from "../guards";
import { arrayIsNonEmpty } from "~/util/array";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenEigentumPages,
);

export const eigentumXstateConfig = {
  id: "eigentum",
  initial: steps.eigentumInfo.relative,
  meta: { done: eigentumDone },
  states: {
    [steps.eigentumInfo.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.partnerschaft === "yes",
            target: steps.eigentumHeiratInfo.relative,
          },
          steps.eigentumBankkonten.relative,
        ],
        BACK: [
          {
            guard: ({ context }) => context.rentsApartment === "yes",
            target: "#wohnung.nebenkosten",
          },
          {
            guard: ({ context }) =>
              context.rentsApartment === "no" &&
              context.livingSituation === "alone",
            target: "#wohnung.eigenheim-nebenkosten",
          },
          {
            guard: ({ context }) =>
              context.rentsApartment === "no" &&
              (context.livingSituation === "withOthers" ||
                context.livingSituation === "withRelatives"),
            target: "#wohnung.eigenheim-nebenkosten-geteilt",
          },
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
                guard: ({ context }) => context.partnerschaft === "yes",
                target: steps.eigentumHeiratInfo.absolute,
              },
              steps.eigentumInfo.absolute,
            ],
            SUBMIT: [
              {
                guard: ({ context }) => context.hasBankkonto === "yes",
                target: steps.eigentumBankkontenUebersicht.relative,
              },
              steps.eigentumGeldanlagen.absolute,
            ],
          },
        },
        [steps.eigentumBankkontenUebersicht.relative]: {
          on: {
            BACK: steps.eigentumBankkontenFrage.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.hasBankkonto === "yes" &&
                  !arrayIsNonEmpty(context.bankkonten),
                target: steps.eigentumBankkontoWarnung.relative,
              },
              steps.eigentumGeldanlagen.absolute,
            ],
            "add-bankkonten": "bankkonto.daten",
          },
        },
        [steps.eigentumBankkontoWarnung.relative]: {
          on: {
            BACK: steps.eigentumBankkontenUebersicht.relative,
            SUBMIT: steps.eigentumGeldanlagen.absolute,
          },
        },
        [steps.eigentumBankkonto.relative]: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: steps.eigentumBankkontenUebersicht.absolute,
                SUBMIT: steps.eigentumBankkontenUebersicht.absolute,
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
            SUBMIT: [
              {
                guard: ({ context }) => context.hasGeldanlage === "yes",
                target: steps.eigentumGeldanlagenUebersicht.relative,
              },
              steps.eigentumKraftfahrzeugeFrage.absolute,
            ],
            BACK: [
              {
                guard: ({ context }) => context.hasBankkonto === "yes",
                target: steps.eigentumBankkontenUebersicht.absolute,
              },
              steps.eigentumBankkontenFrage.absolute,
            ],
          },
        },
        [steps.eigentumGeldanlagenUebersicht.relative]: {
          on: {
            BACK: steps.eigentumGeldanlagenFrage.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.hasGeldanlage === "yes" &&
                  !arrayIsNonEmpty(context.geldanlagen),
                target: steps.eigentumGeldanlagenWarnung.relative,
              },
              steps.eigentumKraftfahrzeugeFrage.absolute,
            ],
            "add-geldanlagen": "geldanlage.art",
          },
        },
        [steps.eigentumGeldanlagenWarnung.relative]: {
          on: {
            BACK: steps.eigentumGeldanlagenUebersicht.relative,
            SUBMIT: steps.eigentumKraftfahrzeugeFrage.absolute,
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
            SUBMIT: [
              {
                guard: hasKraftfahrzeugYes,
                target: steps.eigentumKraftfahrzeugeUebersicht.relative,
              },
              steps.eigentumWertgegenstaende.absolute,
            ],
            BACK: [
              {
                guard: ({ context }) => context.hasGeldanlage === "yes",
                target: steps.eigentumGeldanlagenUebersicht.absolute,
              },
              steps.eigentumGeldanlagenFrage.absolute,
            ],
          },
        },
        [steps.eigentumKraftfahrzeugeUebersicht.relative]: {
          on: {
            BACK: steps.eigentumKraftfahrzeugeFrage.absolute,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  hasKraftfahrzeugYes({ context }) &&
                  !arrayIsNonEmpty(context.kraftfahrzeuge),
                target: steps.eigentumKraftfahrzeugeWarnung.relative,
              },
              steps.eigentumWertgegenstaende.absolute,
            ],
            "add-kraftfahrzeuge": "kraftfahrzeug",
          },
        },
        [steps.eigentumKraftfahrzeugeWarnung.relative]: {
          on: {
            BACK: steps.eigentumKraftfahrzeugeUebersicht.relative,
            SUBMIT: steps.eigentumWertgegenstaende.absolute,
          },
        },
        [steps.eigentumKraftfahrzeug.relative]: {
          initial: "arbeitsweg",
          states: {
            arbeitsweg: {
              on: {
                BACK: steps.eigentumKraftfahrzeugeUebersicht.absolute,
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
                  steps.eigentumKraftfahrzeugeUebersicht.absolute,
                ],
              },
            },
            fahrzeuge: {
              on: {
                BACK: "wert",
                SUBMIT: steps.eigentumKraftfahrzeugeUebersicht.absolute,
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
            SUBMIT: [
              {
                guard: hasWertsacheYes,
                target: steps.eigentumWertgegenstaendeUebersicht.relative,
              },
              steps.eigentumGrundeigentum.absolute,
            ],
            BACK: [
              {
                guard: hasKraftfahrzeugYes,
                target: steps.eigentumKraftfahrzeugeUebersicht.absolute,
              },
              steps.eigentumKraftfahrzeuge.absolute,
            ],
          },
        },
        [steps.eigentumWertgegenstaendeUebersicht.relative]: {
          on: {
            BACK: steps.eigentumWertgegenstaendeFrage.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  hasWertsacheYes({ context }) &&
                  !arrayIsNonEmpty(context.wertsachen),
                target: steps.eigentumWertgegenstaendeWarnung.relative,
              },
              steps.eigentumGrundeigentum.absolute,
            ],
            "add-wertsachen": "wertgegenstand",
          },
        },
        [steps.eigentumWertgegenstaendeWarnung.relative]: {
          on: {
            BACK: steps.eigentumWertgegenstaendeUebersicht.relative,
            SUBMIT: steps.eigentumGrundeigentum.absolute,
          },
        },
        [steps.eigentumWertgegenstand.relative]: {
          initial: "daten",
          states: {
            daten: {
              on: {
                SUBMIT: steps.eigentumWertgegenstaendeUebersicht.absolute,
                BACK: steps.eigentumWertgegenstaendeUebersicht.absolute,
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
            SUBMIT: [
              {
                guard: hasGrundeigentumYes,
                target: steps.eigentumGrundeigentumUebersicht.relative,
              },
              "#ausgaben",
            ],
            BACK: [
              {
                guard: hasWertsacheYes,
                target: steps.eigentumWertgegenstaendeUebersicht.absolute,
              },
              steps.eigentumWertgegenstaende.absolute,
            ],
          },
        },
        [steps.eigentumGrundeigentumUebersicht.relative]: {
          on: {
            BACK: steps.eigentumGrundeigentumFrage.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  hasGrundeigentumYes({ context }) &&
                  !arrayIsNonEmpty(context.grundeigentum),
                target: steps.eigentumGrundeigentumWarnung.relative,
              },
              "#ausgaben",
            ],
            "add-grundeigentum": "grundeigentum",
          },
        },
        [steps.eigentumGrundeigentumGrundeigentum.relative]: {
          initial: "bewohnt-frage",
          states: {
            "bewohnt-frage": {
              on: {
                BACK: steps.eigentumGrundeigentumUebersicht.absolute,
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
                SUBMIT: steps.eigentumGrundeigentumUebersicht.absolute,
              },
            },
            daten: {
              on: {
                BACK: "bewohnt-frage",
                SUBMIT: steps.eigentumGrundeigentumUebersicht.absolute,
              },
            },
          },
        },
        [steps.eigentumGrundeigentumWarnung.relative]: {
          on: {
            BACK: steps.eigentumGrundeigentumUebersicht.relative,
            SUBMIT: "#ausgaben",
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
