import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/domains/__test__/TestCases";
import { type KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { machine } from "./testMachine";

const cases = [
  [{}, ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"]],
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"],
  ],
  [
    { hasKontopfaendung: "ja", hasPKonto: "nichtAktiv" },
    ["/kontopfaendung", "/p-konto", "/p-konto-probleme", "/glaeubiger"],
  ],
  // Glaeubiger
  [{}, ["/glaeubiger", "/euro-schwelle"]],
  [
    {
      schuldenBei: "privat",
    },
    ["/glaeubiger", "/unterhalts-zahlungen", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "jugendamt",
    },
    ["/glaeubiger", "/unterhalts-zahlungen", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "weissNicht",
    },
    ["/glaeubiger", "/glaeubiger-unbekannt", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "staatsanwaltschaft",
    },
    ["/glaeubiger", "/unerlaubten-handlung", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "kasse",
    },
    ["/glaeubiger", "/unerlaubten-handlung", "/euro-schwelle"],
  ],
  // euro-schwelle
  [
    {
      euroSchwelle: "nein",
    },
    ["/euro-schwelle", "/ergebnis/geringe-einkuenfte"],
  ],
  [
    {
      euroSchwelle: "ja",
    },
    ["/euro-schwelle", "/zwischenseite-unterhalt"],
  ],
  // Unterhalt
  [
    {},
    ["/zwischenseite-unterhalt", "/kinder", "/partner", "/zwischenseite-cash"],
  ],
  [
    { hasKinder: "yes" },
    ["/kinder", "/kinder-wohnen-zusammen", "/kinder-support", "/partner"],
  ],
  [
    { verheiratet: "ja" },
    [
      "/partner",
      "/partner-wohnen-zusammen",
      "/partner-support",
      "/zwischenseite-cash",
    ],
  ],
  // Cash
  // [{}, ["/zwischenseite-cash", "/ermittlung-betrags", "/sozialleistungen", "/sozialleistungen-umstaende"]], //TODO nächste Seiten (bis Ergebnis) klären
  [
    { hasArbeit: "yes" },
    [
      "/ermittlung-betrags",
      "/arbeitsweise",
      "/nachzahlung-arbeitgeber",
      "/zahlung-arbeitgeber",
      "/sozialleistungen",
    ],
  ],
  [
    { hasArbeit: "yes", nachzahlungArbeitgeber: "yes" },
    [
      "/arbeitsweise",
      "/nachzahlung-arbeitgeber",
      "/zahlungslimit",
      "/zahlung-arbeitgeber",
      "/sozialleistungen",
    ],
  ],
  [
    {
      hasKontopfaendung: "ja",
      hasPKonto: "nichtEingerichtet",
      schuldenBei: "privat",
      unterhaltszahlungen: "yes",
      euroSchwelle: "ja",
      hasKinder: "yes",
      kinderUnterhalt: "no",
      verheiratet: "nein",
      hasArbeit: "yes",
      nachzahlungArbeitgeber: "yes",
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        nein: CheckboxValue.off,
        kindergeld: CheckboxValue.on,
        pflegegeld: CheckboxValue.off,
        wohngeld: CheckboxValue.off,
      },
      hasSozialleistungNachzahlung: "yes",
    },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/p-konto-probleme",
      "/glaeubiger",
      "/unterhalts-zahlungen",
      "/euro-schwelle",
      "/zwischenseite-unterhalt",
      "/kinder",
      "/kinder-wohnen-zusammen",
      "/kinder-support",
      "/partner",
      "/zwischenseite-cash",
      "/ermittlung-betrags",
      "/arbeitsweise",
      "/nachzahlung-arbeitgeber",
      "/zahlungslimit",
      "/zahlung-arbeitgeber",
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/sozialleistung-nachzahlung",
      "/sozialleistung-nachzahlung-amount",
      "/sozialleistungen-einmalzahlung",
    ],
  ],
] as const satisfies TestCases<KontopfaendungWegweiserContext>;

export const testCasesKontopfaendungWegweiser = { machine, cases };
