import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";

type PKHEinkuenfteSubflowTypes = "partner";

function getSubflowString(
  string: string,
  subflowPrefix?: PKHEinkuenfteSubflowTypes,
) {
  return subflowPrefix ? `${subflowPrefix}-${string}` : string;
}

export const getProzesskostenhilfeEinkuenfteSubflow = (
  subflowPrefix?: PKHEinkuenfteSubflowTypes,
  _doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard = einkuenfteDone,
) => {
  return {
    id: getSubflowString("einkuenfte", subflowPrefix),
    initial: "start",
    meta: { done: einkuenfteDone },
    states: {
      start: {
        on: {
          SUBMIT: "staatliche-leistungen",
          BACK: "#antragStart",
        },
      },
      "staatliche-leistungen": {
        on: {
          SUBMIT: [
            {
              guard: "staatlicheLeistungenIsBuergergeld",
              target: "buergergeld",
            },
            {
              guard: "staatlicheLeistungenIsArbeitslosengeld",
              target: "arbeitslosengeld",
            },
            {
              guard: "staatlicheLeistungenIsKeine",
              target: "einkommen",
            },
            "#abgabe",
          ],
          BACK: "start",
        },
      },
      buergergeld: {
        on: {
          SUBMIT: "einkommen",
          BACK: "staatliche-leistungen",
        },
      },
      arbeitslosengeld: {
        on: {
          SUBMIT: "einkommen",
          BACK: "staatliche-leistungen",
        },
      },
      einkommen: {
        initial: "erwerbstaetig",
        states: {
          erwerbstaetig: {
            on: {
              SUBMIT: [
                {
                  guard: "notEmployed",
                  target: "#einkuenfte.rente-frage",
                },
                "art",
              ],
              BACK: [
                {
                  guard: "staatlicheLeistungenIsBuergergeld",
                  target: "#einkuenfte.buergergeld",
                },
                {
                  guard: "staatlicheLeistungenIsArbeitslosengeld",
                  target: "#einkuenfte.arbeitslosengeld",
                },
                "#einkuenfte.staatliche-leistungen",
              ],
            },
          },
          art: {
            on: {
              SUBMIT: [
                {
                  guard: "isEmployee",
                  target: "netto-einkommen",
                },
                "selbststaendig",
              ],
              BACK: "erwerbstaetig",
            },
          },
          "netto-einkommen": {
            id: "netto-einkommen",
            on: {
              SUBMIT: [
                {
                  guard: "isSelfEmployed",
                  target: "selbststaendig",
                },
                "#einkuenfte.abzuege",
              ],
              BACK: "art",
            },
          },
          selbststaendig: {
            on: {
              SUBMIT: "selbststaendig-abzuege",
              BACK: [
                {
                  guard: "isEmployee",
                  target: "netto-einkommen",
                },
                "#einkuenfte.einkommen.art",
              ],
            },
          },
          "selbststaendig-abzuege": {
            id: "selbststaendig-abzuege",
            on: {
              BACK: "selbststaendig",
              SUBMIT: "#einkuenfte.abzuege",
            },
          },
        },
      },
      abzuege: {
        initial: "arbeitsweg",
        states: {
          arbeitsweg: {
            on: {
              SUBMIT: [
                {
                  guard: "usesPublicTransit",
                  target: "opnv-kosten",
                },
                {
                  guard: "usesPrivateVehicle",
                  target: "arbeitsplatz-entfernung",
                },
                {
                  guard: "commuteMethodPlaysNoRole",
                  target: "keine-rolle",
                },
                "#einkuenfte.abzuege.arbeitsausgaben",
              ],
              BACK: [
                {
                  guard: "isSelfEmployed",
                  target: "#einkuenfte.einkommen.selbststaendig-abzuege",
                },
                "#einkuenfte.einkommen.netto-einkommen",
              ],
            },
          },
          "opnv-kosten": {
            id: "opnv-kosten",
            on: {
              SUBMIT: "arbeitsplatz-entfernung",
              BACK: "arbeitsweg",
            },
          },
          "arbeitsplatz-entfernung": {
            id: "arbeitsplatz-entfernung",
            on: {
              SUBMIT: "#einkuenfte.abzuege.arbeitsausgaben",
              BACK: [
                {
                  guard: "usesPublicTransit",
                  target: "opnv-kosten",
                },
                "arbeitsweg",
              ],
            },
          },
          "keine-rolle": {
            on: {
              SUBMIT: "#einkuenfte.abzuege.arbeitsausgaben",
              BACK: "arbeitsweg",
            },
          },
          arbeitsausgaben: {
            initial: "arbeitsausgaben-frage",
            states: {
              "arbeitsausgaben-frage": {
                id: "arbeitsausgaben-frage",
                on: {
                  SUBMIT: [
                    {
                      guard: "hasAndereArbeitsausgaben",
                      target: "uebersicht",
                    },
                    "#einkuenfte.rente-frage",
                  ],
                  BACK: [
                    {
                      guard: "usesPublicTransit",
                      target: "#einkuenfte.abzuege.arbeitsplatz-entfernung",
                    },
                    {
                      guard: "usesPrivateVehicle",
                      target: "#einkuenfte.abzuege.arbeitsplatz-entfernung",
                    },
                    {
                      guard: "commuteMethodPlaysNoRole",
                      target: "#einkuenfte.abzuege.keine-rolle",
                    },
                    "#einkuenfte.abzuege.arbeitsweg",
                  ],
                },
              },
              uebersicht: {
                on: {
                  SUBMIT: [
                    {
                      guard: "hasAndereArbeitsausgabenAndEmptyArray",
                      target: "warnung",
                    },
                    "#einkuenfte.rente-frage",
                  ],
                  BACK: "arbeitsausgaben-frage",
                  "add-arbeitsausgaben": {
                    guard: "isValidArbeitsausgabenArrayIndex",
                    target: "arbeitsausgabe",
                  },
                },
              },
              warnung: {
                on: {
                  BACK: "uebersicht",
                  SUBMIT: "#einkuenfte.rente-frage",
                },
              },
              arbeitsausgabe: {
                initial: "daten",
                states: {
                  daten: {
                    on: {
                      BACK: "#einkuenfte.abzuege.arbeitsausgaben.uebersicht",
                      SUBMIT: "#einkuenfte.abzuege.arbeitsausgaben.uebersicht",
                    },
                  },
                },
              },
            },
          },
        },
      },
      "rente-frage": {
        id: "rente-frage",
        on: {
          SUBMIT: [
            {
              guard: "receivesPension",
              target: "rente",
            },
            "unterhalt-frage",
          ],
          BACK: [
            {
              guard: "notEmployed",
              target: "einkommen",
            },
            {
              guard: "hasAndereArbeitsausgaben",
              target: "#einkuenfte.abzuege.arbeitsausgaben.uebersicht",
            },
            "#einkuenfte.abzuege.arbeitsausgaben",
          ],
        },
      },
      rente: {
        on: {
          SUBMIT: "unterhalt-frage",
          BACK: "rente-frage",
        },
      },
      "unterhalt-frage": {
        id: "unterhalt-frage",
        on: {
          SUBMIT: [
            {
              guard: "receivesSupport",
              target: "unterhalt",
            },
            "leistungen",
          ],
          BACK: [
            {
              guard: "receivesPension",
              target: "rente",
            },
            "rente-frage",
          ],
        },
      },
      unterhalt: {
        on: {
          SUBMIT: "leistungen",
          BACK: "unterhalt-frage",
        },
      },
      leistungen: {
        initial: "frage",
        states: {
          frage: {
            on: {
              SUBMIT: [
                {
                  guard: "hasWohngeld",
                  target: "wohngeld",
                },
                {
                  guard: "hasKrankengeld",
                  target: "krankengeld",
                },
                {
                  guard: "hasElterngeld",
                  target: "elterngeld",
                },
                {
                  guard: "hasKindergeld",
                  target: "kindergeld",
                },
                "#einkuenfte.weitere-einkuenfte",
              ],
              BACK: [
                {
                  guard: "receivesSupport",
                  target: "#einkuenfte.unterhalt",
                },
                "#einkuenfte.unterhalt-frage",
              ],
            },
          },
          wohngeld: {
            on: {
              SUBMIT: [
                {
                  guard: "hasKrankengeld",
                  target: "krankengeld",
                },
                {
                  guard: "hasElterngeld",
                  target: "elterngeld",
                },
                {
                  guard: "hasKindergeld",
                  target: "#einkuenfte.leistungen.kindergeld",
                },
                "#einkuenfte.weitere-einkuenfte",
              ],
              BACK: "frage",
            },
          },
          krankengeld: {
            on: {
              SUBMIT: [
                {
                  guard: "hasElterngeld",
                  target: "elterngeld",
                },
                {
                  guard: "hasKindergeld",
                  target: "#einkuenfte.leistungen.kindergeld",
                },
                "#einkuenfte.weitere-einkuenfte",
              ],
              BACK: [
                {
                  guard: "hasWohngeld",
                  target: "wohngeld",
                },
                "frage",
              ],
            },
          },
          elterngeld: {
            on: {
              SUBMIT: [
                {
                  guard: "hasKindergeld",
                  target: "#einkuenfte.leistungen.kindergeld",
                },
                "#einkuenfte.weitere-einkuenfte",
              ],
              BACK: [
                {
                  guard: "hasKrankengeld",
                  target: "krankengeld",
                },
                {
                  guard: "hasWohngeld",
                  target: "wohngeld",
                },
                "frage",
              ],
            },
          },
          kindergeld: {
            on: {
              SUBMIT: "#einkuenfte.weitere-einkuenfte",
              BACK: [
                {
                  guard: "hasElterngeld",
                  target: "elterngeld",
                },
                {
                  guard: "hasKrankengeld",
                  target: "krankengeld",
                },
                {
                  guard: "hasWohngeld",
                  target: "wohngeld",
                },
                "frage",
              ],
            },
          },
        },
      },
      "weitere-einkuenfte": {
        id: "weitere-einkuenfte",
        initial: "frage",
        states: {
          frage: {
            on: {
              SUBMIT: [
                {
                  guard: "hasFurtherIncome",
                  target: "uebersicht",
                },
                "#partner",
              ],
              BACK: [
                {
                  guard: "hasKindergeld",
                  target: "#einkuenfte.leistungen.kindergeld",
                },
                {
                  guard: "hasElterngeld",
                  target: "#einkuenfte.leistungen.elterngeld",
                },
                {
                  guard: "hasKrankengeld",
                  target: "#einkuenfte.leistungen.krankengeld",
                },
                {
                  guard: "hasWohngeld",
                  target: "#einkuenfte.leistungen.wohngeld",
                },
                "#einkuenfte.leistungen",
              ],
            },
          },
          uebersicht: {
            on: {
              SUBMIT: [
                {
                  guard: "hasFurtherIncomeAndEmptyArray",
                  target: "warnung",
                },
                "#partner",
              ],
              BACK: "frage",
              "add-weitereEinkuenfte": {
                guard: "isValidEinkuenfteArrayIndex",
                target: "einkunft",
              },
            },
          },
          warnung: {
            on: {
              BACK: "uebersicht",
              SUBMIT: "#partner",
            },
          },
          einkunft: {
            initial: "daten",
            states: {
              daten: {
                on: {
                  BACK: "#einkuenfte.weitere-einkuenfte.uebersicht",
                  SUBMIT: "#einkuenfte.weitere-einkuenfte.uebersicht",
                },
              },
            },
          },
        },
      },
    },
  };
};
