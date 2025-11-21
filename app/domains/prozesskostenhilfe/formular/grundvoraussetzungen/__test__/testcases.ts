import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";

export const testCasesPKHFormularGrundvoraussetzungen = {
  analogNachueberpruefung: [
    { stepId: "/start/start" },
    {
      stepId: "/grundvoraussetzungen/nachueberpruefung-frage",
      userInput: {
        formularArt: "nachueberpruefung",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
      userInput: {
        gerichtName: "AG Muster",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
      userInput: {
        aktenzeichen: "120 / 150 / ABC",
      },
    },
    {
      stepId: "/grundvoraussetzungen/einreichung/fall",
      userInput: {
        versandArt: "analog",
      },
    },
    {
      stepId: "/grundvoraussetzungen/einreichung/hinweis-papier-einreichung",
    },
    {
      stepId: "/antragstellende-person/empfaenger",
    },
  ],
  digitalErstantrag: [
    {
      stepId: "/grundvoraussetzungen/nachueberpruefung-frage",
      userInput: {
        formularArt: "erstantrag",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
      userInput: {
        anhaengigesGerichtsverfahrenFrage: "no",
      },
    },
    {
      stepId: "/grundvoraussetzungen/antrag/klageersteller",
      userInput: {
        verfahrenArt: "verfahrenSelbststaendig",
      },
    },
    { stepId: "/grundvoraussetzungen/antrag/hinweis" },
    {
      stepId: "/grundvoraussetzungen/einreichung/fall",
      userInput: {
        versandArt: "digital",
      },
    },
    {
      stepId: "/grundvoraussetzungen/einreichung/mjp",
    },
    {
      stepId: "/grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
    },
  ],
  erstantragAnhaengigesGericht: [
    {
      stepId: "/grundvoraussetzungen/nachueberpruefung-frage",
      userInput: {
        formularArt: "erstantrag",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
      userInput: {
        anhaengigesGerichtsverfahrenFrage: "yes",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
      userInput: {
        gerichtName: "",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
      userInput: {
        aktenzeichen: "",
      },
    },
    {
      stepId: "/grundvoraussetzungen/antrag/klageersteller",
      userInput: {
        verfahrenArt: "verfahrenAnwalt",
      },
    },
    {
      stepId: "/antragstellende-person/empfaenger",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeGrundvoraussetzungenUserData>;
