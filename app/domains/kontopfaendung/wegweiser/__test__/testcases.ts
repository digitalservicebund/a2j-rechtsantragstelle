import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/domains/__test__/TestCases";
import { type KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { machine } from "./testMachine";

const cases = [
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnisseite"],
  ],
  [
    {
      hasKontopfaendung: "ja",
      hasPKonto: "bank",
      schuldenBei: "privat",
      unterhaltszahlungen: "yes",
      euroSchwelle: "nein",
    },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/p-konto-probleme",
      "/glaeubiger",
      "/unterhalts-zahlungen",
      "/euro-schwelle",
      "/ergebnisseite",
    ],
  ],
  [
    {
      schuldenBei: "jugendamt",
      unterhaltszahlungen: "yes",
      euroSchwelle: "ja",
    },
    ["/glaeubiger", "/unterhalts-zahlungen", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "staatsanwaltschaft",
      unerlaubteHandlung: "yes",
      euroSchwelle: "ja",
    },
    ["/glaeubiger", "/unerlaubten-handlung", "/euro-schwelle"],
  ],
  [
    {
      schuldenBei: "weissNicht",
      unerlaubteHandlung: "yes",
      euroSchwelle: "ja",
    },
    ["/glaeubiger", "/glaeubiger-unbekannt"],
  ],
  [{}, ["/partner", "/partner-wohnen-zusammen", "/partner-support"]],
  [
    {
      hasKontopfaendung: "ja",
      hasPKonto: "bank",
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
  [
    { hasKinder: "yes", verheiratet: "verwitwet" },
    ["/partner", "/partner-wohnen-zusammen"],
  ],
  [{ hasPKonto: "nichtAktiv" }, ["/p-konto", "/p-konto-probleme"]],
] as const satisfies TestCases<KontopfaendungWegweiserContext>;

export const testCasesKontopfaendungWegweiser = { machine, cases };
