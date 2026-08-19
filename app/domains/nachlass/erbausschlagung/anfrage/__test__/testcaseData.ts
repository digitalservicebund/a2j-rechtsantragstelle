import { type NachlassErbausschlagungAnfrageUserData } from "../userData";

export const happyPathData: Partial<NachlassErbausschlagungAnfrageUserData> = {
  pageData: {
    subflowDoneStates: {
      "/ausschlagende-person": true,
    },
  },
  datenverarbeitungZustimmung: "on",
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
  verstorbeneGeburtsdatum: {
    day: "01",
    month: "01",
    year: "1900",
  },
  verstorbeneSterbedatum: {
    day: "01",
    month: "01",
    year: "2020",
  },
  verstorbeneLebensmittelpunkt: "deutschland",
  livedInNursingHome: "no",
  livedInHospice: "no",
  plzVerstorbene: "10969",
  verstorbeneAdresseStrasse: "Musterstraße",
  verstorbeneAdresseHausnummer: "1",
  verstorbeneAdresseOrt: "Musterstadt",
  verstorbeneAdresseZusatz: "",
  awarenessDate: {
    day: "01",
    month: "01",
    year: "2020",
  },
  hasKid: "no",
};
