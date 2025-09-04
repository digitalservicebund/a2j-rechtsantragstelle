import { type TestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const testCasesPKHFormularGrundvoraussetzungen = [
  [
    {
      formularArt: "nachueberpruefung",
      versandArt: "analog",
    },
    [
      "/grundvoraussetzungen/nachueberpruefung-frage",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
      "/grundvoraussetzungen/einreichung/fall",
      "/grundvoraussetzungen/einreichung/hinweis-papier-einreichung",
      "/antragstellende-person/empfaenger",
    ],
  ],
  [
    {
      formularArt: "erstantrag",
      anhaengigesGerichtsverfahrenFrage: "no",
      verfahrenArt: "verfahrenSelbststaendig",
      versandArt: "digital",
    },
    [
      "/start/start",
      "/grundvoraussetzungen/nachueberpruefung-frage",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
      "/grundvoraussetzungen/antrag/klageersteller",
      "/grundvoraussetzungen/antrag/hinweis",
      "/grundvoraussetzungen/einreichung/fall",
      "/grundvoraussetzungen/einreichung/mjp",
      "/grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
    ],
  ],
  [
    {
      formularArt: "erstantrag",
      anhaengigesGerichtsverfahrenFrage: "yes",
      verfahrenArt: "verfahrenAnwalt",
    },
    [
      "/start/start",
      "/grundvoraussetzungen/nachueberpruefung-frage",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
      "/grundvoraussetzungen/antrag/klageersteller",
      "/antragstellende-person/empfaenger",
    ],
  ],
] as Array<
  [ProzesskostenhilfeFormularUserData, string[]]
> satisfies TestCases<ProzesskostenhilfeFormularUserData>;
