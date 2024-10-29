import type { BeratungshilfeVorabcheckContext } from "~/flows/beratungshilfe/beratungshilfeVorabcheck/context";

export const happyPathData: BeratungshilfeVorabcheckContext = {
  rechtsschutzversicherung: "no",
  wurdeVerklagt: "no",
  klageEingereicht: "no",
  hamburgOderBremen: "no",
  beratungshilfeBeantragt: "no",
  eigeninitiative: "yes",
  staatlicheLeistungen: "keine",
  erwerbstaetigkeit: "yes",
  vermoegen: "below_10k",
  genauigkeit: "yes",
  partnerschaft: "yes",
  einkommenPartner: "100",
  kinder: "yes",
  kids: {
    kids6Below: "1",
    kids7To14: "0",
    kids15To18: "0",
    kids18Above: "0",
  },
  einkommenKinder: "0",
  unterhalt: "yes",
  unterhaltSumme: "100",
  einkommen: "100",
  miete: "1000",
  weitereZahlungenSumme: "200",
};
