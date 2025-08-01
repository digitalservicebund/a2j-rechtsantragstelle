import merge from "lodash/merge";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
  wohnungDone,
  eigentumDone,
} from "./doneFunctions";
import { einkuenfteDone } from "./einkuenfte/doneFunctions";
import { partnerEinkuenfteGuards } from "./einkuenfte/guards";
import { getProzesskostenhilfeEinkuenfteSubflow } from "./einkuenfte/xStateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(pkhFormularFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: "einkuenfte",
  id: "finanzielle-angaben",
  states: {
    einkuenfte: getProzesskostenhilfeEinkuenfteSubflow(einkuenfteDone),
    partner: {
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
        "partner-einkuenfte": merge(
          getProzesskostenhilfeEinkuenfteSubflow(einkuenfteDone, "partner"),
          {
            states: {
              "partner-besonders-ausgaben": {
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
              "add-partner-besonders-ausgaben": {
                on: {
                  SUBMIT: "#kinder",
                  BACK: "partner-besonders-ausgaben",
                },
              },
            },
          },
        ),
      },
    },

    kinder: {
      id: "kinder",
      initial: "kinder-frage",
      meta: { done: kinderDone },
      states: {
        "kinder-frage": {
          on: {
            SUBMIT: [
              {
                guard: "hasKinderYes",
                target: "uebersicht",
              },
              "#andere-unterhaltszahlungen.frage",
            ],
            BACK: [
              {
                guard: "hasPartnerschaftNo",
                target: "#partner",
              },
              {
                guard: "partnerEinkommenNo",
                target: steps.partnerEinkommen.absolute,
              },
              {
                guard:
                  partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen,
                target: "#partner-einkuenfte.partner-staatliche-leistungen",
              },
              {
                guard: "partnerHasBesondersAusgabenYes",
                target: "#partner-einkuenfte.add-partner-besonders-ausgaben",
              },
              {
                guard: "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes",
                target: steps.partnerName.absolute,
              },
              {
                guard: "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo",
                target: steps.partnerKeineRolle.absolute,
              },
              "#partner-einkuenfte.partner-besonders-ausgaben",
            ],
          },
        },
        uebersicht: {
          on: {
            BACK: "kinder-frage",
            SUBMIT: [
              {
                guard: "hasKinderYesAndEmptyArray",
                target: "warnung",
              },
              "#andere-unterhaltszahlungen",
            ],
            "add-kinder": {
              guard: "isValidKinderArrayIndex",
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
                    guard: "kindWohnortBeiAntragstellerYes",
                    target: "kind-eigene-einnahmen-frage",
                  },
                  {
                    guard: "kindWohnortBeiAntragstellerNo",
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
                    guard: "kindEigeneEinnahmenYes",
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
                    guard: "kindUnterhaltYes",
                    target: "kind-unterhalt",
                  },
                  {
                    guard: "kindUnterhaltNo",
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
    "andere-unterhaltszahlungen": {
      id: "andere-unterhaltszahlungen",
      meta: { done: andereUnterhaltszahlungenDone },
      initial: "frage",
      states: {
        frage: {
          on: {
            BACK: [
              {
                guard: "hasKinderYes",
                target: "#kinder.uebersicht",
              },
              "#kinder.kinder-frage",
            ],
            SUBMIT: [
              {
                guard: "hasWeitereUnterhaltszahlungenYes",
                target: "uebersicht",
              },
              "#wohnung",
            ],
          },
        },
        uebersicht: {
          on: {
            BACK: "frage",
            SUBMIT: [
              {
                guard: "hasWeitereUnterhaltszahlungenYesAndEmptyArray",
                target: "warnung",
              },
              "#wohnung",
            ],
            "add-unterhaltszahlungen": "person",
          },
        },
        warnung: {
          on: {
            BACK: "uebersicht",
            SUBMIT: "#wohnung",
          },
        },
        person: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#andere-unterhaltszahlungen.uebersicht",
                SUBMIT: "#andere-unterhaltszahlungen.uebersicht",
              },
            },
          },
        },
      },
    },
    wohnung: {
      id: "wohnung",
      initial: "alleine-zusammen",
      meta: { done: wohnungDone },
      states: {
        "alleine-zusammen": {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.livingSituation === "alone",
                target: "groesse",
              },
              "anzahl-mitbewohner",
            ],
            BACK: [
              {
                guard: "hasWeitereUnterhaltszahlungenYes",
                target:
                  "#finanzielle-angaben.andere-unterhaltszahlungen.uebersicht",
              },
              "#finanzielle-angaben.andere-unterhaltszahlungen.frage",
            ],
          },
        },
        "anzahl-mitbewohner": {
          on: {
            BACK: "alleine-zusammen",
            SUBMIT: "groesse",
          },
        },
        groesse: {
          on: {
            BACK: [
              {
                guard: ({ context }) => context.livingSituation === "alone",
                target: "alleine-zusammen",
              },
              "anzahl-mitbewohner",
            ],
            SUBMIT: "anzahl-zimmer",
          },
        },
        "anzahl-zimmer": { on: { BACK: "groesse", SUBMIT: "miete-eigenheim" } },
        "miete-eigenheim": {
          on: {
            BACK: "anzahl-zimmer",
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.rentsApartment === "yes" &&
                  context.livingSituation === "alone",
                target: "miete-alleine",
              },
              {
                guard: ({ context }) =>
                  context.rentsApartment === "no" &&
                  context.livingSituation === "alone",
                target: "eigenheim-nebenkosten",
              },
              {
                guard: ({ context }) =>
                  context.rentsApartment === "no" &&
                  (context.livingSituation === "withOthers" ||
                    context.livingSituation === "withRelatives"),
                target: "eigenheim-nebenkosten-geteilt",
              },
              "miete-zusammen",
            ],
          },
        },
        "miete-alleine": {
          on: { BACK: "miete-eigenheim", SUBMIT: "nebenkosten" },
        },
        "miete-zusammen": {
          on: { BACK: "miete-eigenheim", SUBMIT: "nebenkosten" },
        },
        nebenkosten: {
          on: {
            BACK: [
              {
                guard: ({ context }) => context.livingSituation === "alone",
                target: "miete-alleine",
              },
              "miete-zusammen",
            ],
            SUBMIT: "#eigentum",
          },
        },

        "eigenheim-nebenkosten": {
          on: { BACK: "miete-eigenheim", SUBMIT: "#eigentum" },
        },
        "eigenheim-nebenkosten-geteilt": {
          on: { BACK: "miete-eigenheim", SUBMIT: "#eigentum" },
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
