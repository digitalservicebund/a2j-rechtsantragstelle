import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
  testamentArt: "none",
  antragstellendePersonTelefonnummer: "0123456789",
};

export const ehepartnerTestCases = {
  widowed: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "verwitwet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/sterbedatum-ort",
      userInput: {
        spouseSterbedatum: {
          day: "01",
          month: "01",
          year: "2020",
        },
        spouseSterbeort: "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  divorced: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "geschieden",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  marriedSameAddressSingleNationality: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/andere-adresse",
      userInput: {
        spouseHasDifferentAddress: "no",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/staatsangehoerigkeit",
      userInput: {
        ehepartnerStaatsangehoerigkeit: "deutsch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit-frage",
      userInput: {
        ehepartnerHadSecondNationality: "no",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      userInput: {
        hasEhevertrag: "no",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  marriedSameAddressDoubleNationality: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/andere-adresse",
      userInput: {
        spouseHasDifferentAddress: "no",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/staatsangehoerigkeit",
      userInput: {
        ehepartnerStaatsangehoerigkeit: "deutsch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit-frage",
      userInput: {
        ehepartnerHadSecondNationality: "yes",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit",
      userInput: {
        ehepartnerZweiteStaatsangehoerigkeit: "angolisch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      userInput: {
        hasEhevertrag: "no",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  marriedDifferentAddressSingleNationality: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/andere-adresse",
      userInput: {
        spouseHasDifferentAddress: "yes",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/anschrift",
      userInput: {
        ehepartnerStrasse: "Musterstraße",
        ehepartnerHausnummer: "1",
        ehepartnerPlz: "12345",
        ehepartnerOrt: "Musterstadt",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/staatsangehoerigkeit",
      userInput: {
        ehepartnerStaatsangehoerigkeit: "amerikanisch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit-frage",
      userInput: {
        ehepartnerHadSecondNationality: "no",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      userInput: {
        hasEhevertrag: "yes",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  marriedDifferentAddressDoubleNationality: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/andere-adresse",
      userInput: {
        spouseHasDifferentAddress: "yes",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/anschrift",
      userInput: {
        ehepartnerStrasse: "Musterstraße",
        ehepartnerHausnummer: "1",
        ehepartnerPlz: "12345",
        ehepartnerOrt: "Musterstadt",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/staatsangehoerigkeit",
      userInput: {
        ehepartnerStaatsangehoerigkeit: "amerikanisch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit-frage",
      userInput: {
        ehepartnerHadSecondNationality: "yes",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit",
      userInput: {
        ehepartnerZweiteStaatsangehoerigkeit: "neuseelaendisch",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      userInput: {
        hasEhevertrag: "yes",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
