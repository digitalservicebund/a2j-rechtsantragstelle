import { ProzesskostenhilfeFormularUserData } from "../../userData";

export const finanzielleAngabenTestcaseData: Partial<ProzesskostenhilfeFormularUserData> =
  {
    formularArt: "erstantrag",
    anhaengigesGerichtsverfahrenFrage: "yes",
    gerichtName: "",
    aktenzeichen: "",
    verfahrenArt: "verfahrenSelbststaendig",
    versandArt: "digital",
    empfaenger: "myself",
    unterhaltsanspruch: "keine",
    staatlicheLeistungen: "keine",
    currentlyEmployed: "yes",
    hasRsv: "no",
    hasRsvCoverage: "no",
    employmentType: "employed",
    nettoEinkuenfteAlsArbeitnehmer: "1000",
    receivesPension: "no",
    leistungen: {
      wohngeld: "off",
      krankengeld: "off",
      elterngeld: "off",
      kindergeld: "off",
      none: "on",
    },
    hasFurtherIncome: "no",
    arbeitsweg: "none",
    hasArbeitsausgaben: "no",
  };
