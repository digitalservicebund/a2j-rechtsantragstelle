import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  eigentumDone,
} from "./doneFunctions";
import { finanzielleAngabenEinkuenfteXstateConfig } from "./einkuenfte/xStateConfig";
import { andereUnterhaltszahlungenXstateConfig } from "./andere-unterhaltszahlungen/xstateConfig";
import { kinderXstateConfig } from "./kinder/xstateConfig";
import { partnerXstateConfig } from "./partner/xstateConfig";
import { wohnungXstateConfig } from "./wohnung/xstateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(pkhFormularFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: "einkuenfte",
  id: "finanzielle-angaben",
  states: {
    einkuenfte: finanzielleAngabenEinkuenfteXstateConfig,
    partner: partnerXstateConfig,
    kinder: kinderXstateConfig,
    "andere-unterhaltszahlungen": andereUnterhaltszahlungenXstateConfig,
    wohnung: wohnungXstateConfig,
    eigentum: {
      id: "eigentum",
      initial: "eigentum-info",
      meta: { done: eigentumDone },
      states: {
        "eigentum-info": {
          on: {
            SUBMIT: [
              {
                guard: "hasPartnerschaftYes",
                target: "heirat-info",
              },
              "bankkonten-frage",
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
        "heirat-info": {
          on: {
            BACK: "eigentum-info",
            SUBMIT: "bankkonten-frage",
          },
        },
        "bankkonten-frage": {
          on: {
            BACK: [
              {
                guard: "hasPartnerschaftYes",
                target: "heirat-info",
              },
              "eigentum-info",
            ],
            SUBMIT: "geldanlagen-frage",
          },
        },
        "geldanlagen-frage": {
          on: {
            SUBMIT: "wertgegenstaende-frage",
            BACK: "bankkonten-frage",
          },
        },
        "wertgegenstaende-frage": {
          on: {
            SUBMIT: "grundeigentum-frage",
            BACK: "geldanlagen-frage",
          },
        },
        "grundeigentum-frage": {
          on: {
            SUBMIT: "kraftfahrzeuge-frage",
            BACK: "wertgegenstaende-frage",
          },
        },
        "kraftfahrzeuge-frage": {
          on: {
            SUBMIT: [
              {
                guard: "eigentumDone",
                target: "#eigentum-zusammenfassung.zusammenfassung",
              },
              "#ausgaben",
            ],
            BACK: "grundeigentum-frage",
          },
        },
      },
    },
    "eigentum-zusammenfassung": {
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
                guard: "eigentumYesAndEmptyArray",
                target: "#eigentum-zusammenfassung.warnung",
              },
              {
                guard: "eigentumDone",
                target: "#eigentum-zusammenfassung.zusammenfassung",
              },
              "#eigentum.kraftfahrzeuge-frage",
            ],
            SUBMIT: [
              {
                guard: "hasAusgabenYes",
                target: "besondere-belastungen",
              },
              "#gesetzliche-vertretung",
            ],
          },
        },
        "besondere-belastungen": {
          on: {
            BACK: "ausgaben-frage",
            SUBMIT: ["#ausgaben-zusammenfassung"],
          },
        },
      },
    },
    "ausgaben-zusammenfassung": {
      id: "ausgaben-zusammenfassung",
      initial: "zusammenfassung",
      meta: { done: ausgabenZusammenfassungDone },
      states: {
        zusammenfassung: {
          on: {
            BACK: "#ausgaben.besondere-belastungen",
            SUBMIT: "#gesetzliche-vertretung",
            "add-versicherungen": "versicherungen",
            "add-ratenzahlungen": "ratenzahlungen",
            "add-sonstigeAusgaben": "sonstigeAusgaben",
          },
        },
        versicherungen: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: [
                  {
                    guard: "isSonstigeVersicherung",
                    target: "sonstige-art",
                  },
                  "#ausgaben-zusammenfassung",
                ],
              },
            },
            "sonstige-art": {
              on: {
                BACK: "daten",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
        ratenzahlungen: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: "zahlungspflichtiger",
              },
            },
            zahlungspflichtiger: {
              on: {
                BACK: "daten",
                SUBMIT: [
                  {
                    guard: "ratenzahlungAnteiligYes",
                    target: "betragGemeinsamerAnteil",
                  },
                  "betragGesamt",
                ],
              },
            },
            betragGemeinsamerAnteil: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "betragEigenerAnteil",
              },
            },
            betragEigenerAnteil: {
              on: {
                BACK: "betragGemeinsamerAnteil",
                SUBMIT: "restschuld",
              },
            },
            betragGesamt: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "restschuld",
              },
            },
            restschuld: {
              on: {
                BACK: [
                  {
                    guard: "ratenzahlungAnteiligYes",
                    target: "betragEigenerAnteil",
                  },
                  "betragGesamt",
                ],
                SUBMIT: "laufzeitende",
              },
            },
            laufzeitende: {
              on: {
                BACK: "restschuld",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
        sonstigeAusgaben: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: "zahlungspflichtiger",
              },
            },
            zahlungspflichtiger: {
              on: {
                BACK: "daten",
                SUBMIT: [
                  {
                    guard: "sonstigeAusgabeAnteiligYes",
                    target: "betragGemeinsamerAnteil",
                  },
                  "betragGesamt",
                ],
              },
            },
            betragGemeinsamerAnteil: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "betragEigenerAnteil",
              },
            },
            betragEigenerAnteil: {
              on: {
                BACK: "betragGemeinsamerAnteil",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
            betragGesamt: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
