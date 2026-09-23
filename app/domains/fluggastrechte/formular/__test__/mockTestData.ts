import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const fluggastrechteFormularHappyPathData: Partial<FluggastrechteUserData> =
  {
    prozesszinsen: "yes",
    vorname: "Max",
    nachname: "Mustermann",
    strasse: "Musterstraße",
    hausnummer: "1",
    plz: "10115",
    ort: "Berlin",
    isWeiterePersonen: "no",
    fluggesellschaft: "LH",
  };
