import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenEigentumPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/eigentum/pages";
import type { Config } from "~/services/flow/server/types";
import { eigentumDone, eigentumZusammenfassungDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

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
            guard: "hasPartnerschaftYes",
            target: steps.eigentumHeiratInfo.relative,
          },
          steps.eigentumBankkontenFrage.relative,
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
        SUBMIT: steps.eigentumBankkontenFrage.relative,
      },
    },
    [steps.eigentumBankkontenFrage.relative]: {
      on: {
        BACK: [
          {
            guard: "hasPartnerschaftYes",
            target: steps.eigentumHeiratInfo.relative,
          },
          steps.eigentumInfo.relative,
        ],
        SUBMIT: steps.eigentumGeldanlagenFrage.relative,
      },
    },
    [steps.eigentumGeldanlagenFrage.relative]: {
      on: {
        SUBMIT: steps.eigentumWertgegenstaendeFrage.relative,
        BACK: steps.eigentumBankkontenFrage.relative,
      },
    },
    [steps.eigentumWertgegenstaendeFrage.relative]: {
      on: {
        SUBMIT: steps.eigentumGrundeigentumFrage.relative,
        BACK: steps.eigentumGeldanlagenFrage.relative,
      },
    },
    [steps.eigentumGrundeigentumFrage.relative]: {
      on: {
        SUBMIT: steps.eigentumKraftfahrzeugeFrage.relative,
        BACK: steps.eigentumWertgegenstaendeFrage.relative,
      },
    },
    [steps.eigentumKraftfahrzeugeFrage.relative]: {
      on: {
        SUBMIT: [
          {
            guard: "eigentumDone",
            target: "#eigentum-zusammenfassung.zusammenfassung",
          },
          "#ausgaben",
        ],
        BACK: steps.eigentumGrundeigentumFrage.relative,
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;

export const eigentumZusammenfassungXstateConfig = {
  id: "eigentum-zusammenfassung",
  initial: "zusammenfassung",
  meta: { done: eigentumZusammenfassungDone },
  states: {
    zusammenfassung: {
      on: {
        BACK: "#eigentum.kraftfahrzeuge-frage",
        SUBMIT: [
          {
            guard: "eigentumYesAndEmptyArray",
            target: "warnung",
          },
          "#ausgaben",
        ],
        "add-bankkonten": "bankkonten",
        "add-wertsachen": "wertgegenstaende",
        "add-geldanlagen": "geldanlagen",
        "add-kraftfahrzeuge": "kraftfahrzeuge",
        "add-grundeigentum": "grundeigentum",
      },
    },
    warnung: {
      on: {
        BACK: "#eigentum-zusammenfassung.zusammenfassung",
        SUBMIT: "#ausgaben",
      },
    },
    bankkonten: {
      initial: "daten",
      states: {
        daten: {
          on: {
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
            BACK: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
      },
    },
    kraftfahrzeuge: {
      initial: "arbeitsweg",
      states: {
        arbeitsweg: {
          on: {
            BACK: "#eigentum-zusammenfassung.zusammenfassung",
            SUBMIT: "wert",
          },
        },
        wert: {
          on: {
            BACK: "arbeitsweg",
            SUBMIT: [
              {
                guard: "isKraftfahrzeugWertAbove10000OrUnsure",
                target: "fahrzeuge",
              },
              "#eigentum-zusammenfassung.zusammenfassung",
            ],
          },
        },
        fahrzeuge: {
          on: {
            BACK: "wert",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
      },
    },
    geldanlagen: {
      id: "geldanlagen",
      initial: "art",
      states: {
        art: {
          on: {
            SUBMIT: [
              {
                target: "bargeld",
                guard: "isGeldanlageBargeld",
              },
              {
                target: "wertpapiere",
                guard: "isGeldanlageWertpapiere",
              },
              {
                target: "guthabenkonto-krypto",
                guard: "isGeldanlageGuthabenkontoKrypto",
              },
              {
                target: "giro-tagesgeld-sparkonto",
                guard: "isGeldanlageGiroTagesgeldSparkonto",
              },
              {
                target: "befristet",
                guard: "isGeldanlageBefristet",
              },
              {
                target: "forderung",
                guard: "isGeldanlageForderung",
              },
              {
                target: "sonstiges",
                guard: "isGeldanlageSonstiges",
              },
            ],
            BACK: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        bargeld: {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        wertpapiere: {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        "guthabenkonto-krypto": {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        "giro-tagesgeld-sparkonto": {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        befristet: {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        forderung: {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        sonstiges: {
          on: {
            BACK: "art",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
      },
    },
    grundeigentum: {
      initial: "bewohnt-frage",
      states: {
        "bewohnt-frage": {
          on: {
            BACK: "#eigentum-zusammenfassung.zusammenfassung",
            SUBMIT: [
              {
                guard: "grundeigentumIsBewohnt",
                target: "bewohnt-daten",
              },
              "daten",
            ],
          },
        },
        daten: {
          on: {
            BACK: "bewohnt-frage",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
        "bewohnt-daten": {
          on: {
            BACK: "bewohnt-frage",
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
      },
    },
    wertgegenstaende: {
      initial: "daten",
      states: {
        daten: {
          on: {
            SUBMIT: "#eigentum-zusammenfassung.zusammenfassung",
            BACK: "#eigentum-zusammenfassung.zusammenfassung",
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
