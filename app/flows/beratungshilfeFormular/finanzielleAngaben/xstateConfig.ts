import _ from "lodash";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeFinanzielleAngaben } from "./context";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  eigentumDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
} from "./doneFunctions";
import { eigentumZusammenfassungDone } from "./eigentumZusammenfassungDone";
import { finanzielleAngabeGuards as guards } from "./guards";

export const beratungshilfeFinanzielleAngabenXstateConfig = {
  initial: "einkommen",
  id: "finanzielle-angaben",
  on: {
    SUBMIT: "#persoenliche-daten.start",
    BACK: "#rechtsproblem.situation-beschreibung",
  },
  states: {
    einkommen: {
      id: "einkommen",
      initial: "start",
      meta: { done: einkommenDone },
      states: {
        start: {
          on: {
            SUBMIT: "staatliche-leistungen",
          },
        },
        "staatliche-leistungen": {
          on: {
            SUBMIT: [
              {
                guard: guards.staatlicheLeistungenIsBuergergeld,
                target: "#eigentum.eigentum-info",
              },
              {
                guard: guards.staatlicheLeistungenIsKeine,
                target: "erwerbstaetig",
              },
              "#persoenliche-daten.start",
            ],
            BACK: "start",
          },
        },
        erwerbstaetig: {
          on: {
            BACK: "staatliche-leistungen",
            SUBMIT: [
              {
                guard: guards.erwerbstaetigYes,
                target: "art",
              },
              "situation",
            ],
          },
        },
        art: {
          on: {
            BACK: "erwerbstaetig",
            SUBMIT: "situation",
          },
        },
        situation: {
          on: {
            BACK: [
              {
                guard: guards.erwerbstaetigYes,
                target: "art",
              },
              "erwerbstaetig",
            ],
            SUBMIT: "weiteres-einkommen",
          },
        },
        "weiteres-einkommen": {
          on: {
            SUBMIT: "einkommen",
            BACK: "situation",
          },
        },
        einkommen: {
          on: {
            BACK: "weiteres-einkommen",
            SUBMIT: "#partner.partnerschaft",
          },
        },
      },
    },
    partner: _.merge(
      getFinanzielleAngabenPartnerSubflow(partnerDone, {
        backStep: "#einkommen.einkommen",
        playsNoRoleTarget: "#kinder.kinder-frage",
        partnerNameTarget: "#kinder.kinder-frage",
        partnerIncomeTarget: "partner-einkommen-summe",
        nextStep: "#kinder.kinder-frage",
      }),
      {
        id: "partner",
        initial: "partnerschaft",
        states: {
          partnerschaft: {},
          "partner-einkommen-summe": {
            on: {
              BACK: "partner-einkommen",
              SUBMIT: "#kinder.kinder-frage",
            },
          },
        },
      },
    ),
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
    "andere-unterhaltszahlungen": {
      id: "andere-unterhaltszahlungen",
      initial: "frage",
      meta: { done: andereUnterhaltszahlungenDone },
      states: {
        frage: {
          on: {
            BACK: [
              {
                guard: guards.staatlicheLeistungenIsBuergergeld,
                target: "#einkommen.staatliche-leistungen",
              },
              {
                guard: guards.hasKinderYes,
                target: "#kinder.uebersicht",
              },
              "#kinder.kinder-frage",
            ],
            SUBMIT: [
              {
                guard: guards.hasWeitereUnterhaltszahlungenYes,
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
                guard: guards.hasWeitereUnterhaltszahlungenYesAndEmptyArray,
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
              "bankkonten-frage",
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
            SUBMIT: "bankkonten-frage",
          },
        },
        "bankkonten-frage": {
          on: {
            BACK: [
              {
                guard: guards.hasPartnerschaftYesAndNoStaatlicheLeistungen,
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
                guard: guards.hasAnyEigentumExceptBankaccount,
                target: "gesamtwert",
              },
              {
                guard: guards.eigentumDone,
                target: "#eigentum-zusammenfassung.zusammenfassung",
              },
              {
                guard: guards.staatlicheLeistungenIsBuergergeld,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben",
            ],
            BACK: "grundeigentum-frage",
          },
        },
        gesamtwert: {
          on: {
            SUBMIT: [
              {
                target: "#eigentum-zusammenfassung.zusammenfassung",
                guard: guards.eigentumDone,
              },
              {
                target: "#persoenliche-daten.start",
                guard: guards.staatlicheLeistungenIsBuergergeld,
              },
              "#ausgaben",
            ],
            BACK: "kraftfahrzeuge-frage",
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
            BACK: [
              {
                guard: guards.hasAnyEigentumExceptBankaccount,
                target: "#eigentum.gesamtwert",
              },
              "#eigentum.kraftfahrzeuge-frage",
            ],
            SUBMIT: [
              {
                guard: guards.eigentumYesAndEmptyArray,
                target: "warnung",
              },
              {
                guard: guards.hasStaatlicheLeistungen,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben.ausgaben-frage",
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
            BACK: "zusammenfassung",
            SUBMIT: [
              {
                guard: guards.hasStaatlicheLeistungen,
                target: "#persoenliche-daten.start",
              },
              "#ausgaben",
            ],
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
                    guard: guards.isKraftfahrzeugWertAbove10000OrUnsure,
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
                    guard: guards.grundeigentumIsBewohnt,
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
                guard: guards.eigentumDone,
                target: "#eigentum-zusammenfassung.zusammenfassung",
              },
              {
                guard: guards.hasAnyEigentumExceptBankaccount,
                target: "#eigentum.gesamtwert",
              },
              "#eigentum.kraftfahrzeuge-frage",
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
} satisfies Config<BeratungshilfeFinanzielleAngaben>;
