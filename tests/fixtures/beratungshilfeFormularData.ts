import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";

export const happyPathData: BeratungshilfeFormularContext = {
  rechtsschutzversicherung: "no",
  wurdeVerklagt: "no",
  klageEingereicht: "no",
  beratungshilfeBeantragt: "no",
  eigeninitiativeGrundvorraussetzung: "no",
  anwaltskanzlei: "no",
  bereich: "authorities",
  beschreibung: "sdfsdf",
  staatlicheLeistungen: "keine",
  erwerbstaetig: "no",
  berufsituation: "no",
  weitereseinkommen: {
    unterhaltszahlungen: CheckboxValue.off,
    arbeitlosengeld: CheckboxValue.off,
    wohngeld: CheckboxValue.off,
    kindergeld: CheckboxValue.off,
    bafoeg: CheckboxValue.off,
    krankengeld: CheckboxValue.off,
    rente: CheckboxValue.off,
    elterngeld: CheckboxValue.off,
    insolvenzgeld: CheckboxValue.off,
    ueberbrueckungsgeld: CheckboxValue.off,
    others: CheckboxValue.on,
  },
  einkommen: "4,00",
  partnerschaft: "no",
  hasKinder: "yes",
  hasBankkonto: "no",
  hasKraftfahrzeug: "no",
  hasGeldanlage: "no",
  hasGrundeigentum: "no",
  hasWertsache: "no",
  kinder: [
    {
      vorname: "Kind 1",
      nachname: "Nachname 1",
      geburtsdatum: "12.12.1212",
      wohnortBeiAntragsteller: "yes",
      eigeneEinnahmen: "yes",
      einnahmen: "10",
      unterhalt: "yes",
      unterhaltsSumme: "10",
    },
    {
      vorname: "Kind 2",
      nachname: "Nachname 2",
      geburtsdatum: "11.12.1212",
      wohnortBeiAntragsteller: "yes",
      eigeneEinnahmen: "yes",
      einnahmen: "10",
      unterhalt: "yes",
      unterhaltsSumme: "10",
    },
  ],
};
