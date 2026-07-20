import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

export const verstorbenePersonTestCases: FlowTestCases<NachlassErbscheinAnfrageUserData> =
  {
    singleNationality: [
      {
        stepId: "/verstorbene/name",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneVorname: "Max",
          verstorbeneNachname: "Mustermann",
        },
      },
      {
        stepId: "/verstorbene/sterbedatum-ort",
        userInput: {
          sterbedatum: { day: "01", month: "01", year: "2020" },
          sterbeort: "Berlin",
        },
      },
      {
        stepId: "/verstorbene/geburtsdatum-ort",
        userInput: {
          verstorbeneGeburtsdatum: { day: "01", month: "01", year: "1980" },
          verstorbeneGeburtsort: "Hamburg",
        },
      },
      {
        stepId: "/verstorbene/familienstand",
        userInput: {
          verstorbeneFamilienstand: "ledig",
        },
      },
      {
        stepId: "/verstorbene/staatsangehoerigkeit",
        userInput: {
          verstorbeneStaatsangehoerigkeit: "deutsch",
        },
      },
      {
        stepId: "/verstorbene/zweite-staatsangehoerigkeit-frage",
        userInput: {
          verstorbeneHadSecondNationality: "no",
        },
      },
      {
        stepId: "/verstorbene/lebensmittelpunkt",
      },
    ],
    dualNationality: [
      {
        stepId: "/verstorbene/zweite-staatsangehoerigkeit-frage",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneHadSecondNationality: "yes",
        },
      },
      {
        stepId: "/verstorbene/zweite-staatsangehoerigkeit",
        userInput: {
          verstorbeneZweiteStaatsangehoerigkeit: "oesterreichisch",
        },
      },
      {
        stepId: "/verstorbene/dritte-staatsangehoerigkeit-frage",
        userInput: {
          verstorbeneHadThirdNationality: "no",
        },
      },
      {
        stepId: "/verstorbene/lebensmittelpunkt",
      },
    ],
    tripleNationality: [
      {
        stepId: "/verstorbene/dritte-staatsangehoerigkeit-frage",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneHadSecondNationality: "yes",
          verstorbeneHadThirdNationality: "yes",
        },
      },
      {
        stepId: "/verstorbene/dritte-staatsangehoerigkeit",
        userInput: {
          verstorbeneDritteStaatsangehoerigkeit: "franzoesisch",
        },
      },
      {
        stepId: "/verstorbene/lebensmittelpunkt",
      },
    ],
    auslaendischerLebensmittelpunkt: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneLebensmittelpunkt: "ausland",
        },
      },
      {
        stepId: "/verstorbene/auslaendischer-erbfall-info",
      },
      {
        stepId: "/verstorbene/auslaendische-adresse",
        userInput: {
          verstorbenePersonAuslaendischeStrasse: "Musterstraße",
          verstorbenePersonAuslaendischeHausnummer: "1",
          verstorbenePersonAuslaendischerOrt: "Musterstadt",
          verstorbenePersonLand: "Österreich",
        },
      },
      {
        stepId: "/antragstellende-person/name",
      },
    ],
    pflegeheim: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneLebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          verstorbeneLivedInPflegeheim: "yes",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim-plz",
        userInput: {
          verstorbenePflegeheimPlz: "12437",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbenePersonStrasse: "Musterstraße",
          verstorbenePersonHausnummer: "1",
          verstorbenePersonOrt: "Musterstadt",
        },
      },
      {
        stepId: "/antragstellende-person/name",
      },
    ],
    hospiz: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneLebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          verstorbeneLivedInPflegeheim: "no",
        },
      },
      {
        stepId: "/verstorbene/hospiz",
        userInput: {
          verstorbeneLivedInHospiz: "yes",
        },
      },
      {
        stepId: "/verstorbene/hospiz-plz",
        userInput: {
          verstorbeneHospizPlz: "12437",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbenePersonStrasse: "Musterstraße",
          verstorbenePersonHausnummer: "1",
          verstorbenePersonOrt: "Musterstadt",
        },
      },
      {
        stepId: "/antragstellende-person/name",
      },
    ],
    deutschlandLebensmittelpunktNoPflegeheimOrHospiz: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          datenverarbeitungZustimmung: "on",
          verstorbeneLebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          verstorbeneLivedInPflegeheim: "no",
        },
      },
      {
        stepId: "/verstorbene/hospiz",
        userInput: {
          verstorbeneLivedInHospiz: "no",
        },
      },
      {
        stepId: "/verstorbene/plz",
        userInput: {
          verstorbenePlz: "12437",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbenePersonStrasse: "Musterstraße",
          verstorbenePersonHausnummer: "1",
          verstorbenePersonOrt: "Musterstadt",
        },
      },
      {
        stepId: "/antragstellende-person/name",
      },
    ],
  };
