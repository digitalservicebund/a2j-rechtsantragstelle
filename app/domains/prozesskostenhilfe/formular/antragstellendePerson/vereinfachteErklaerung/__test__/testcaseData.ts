import { ProzesskostenhilfeFormularUserData } from "../../../userData";

export const vereinfachteErklaerungTestcaseData: Partial<ProzesskostenhilfeFormularUserData> =
  {
    formularArt: "erstantrag",
    anhaengigesGerichtsverfahrenFrage: "yes",
    gerichtName: "",
    aktenzeichen: "",
    verfahrenArt: "verfahrenAnwalt",
    versandArt: "digital",
    child: {
      vorname: "Max",
      nachname: "Mustermann",
      geburtsdatum: "10.10.2005",
    },
    livesTogether: "yes",
  };
