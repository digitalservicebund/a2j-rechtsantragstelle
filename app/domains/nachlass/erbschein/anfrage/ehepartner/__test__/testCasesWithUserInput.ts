import { type FlowTestCases } from "~/domains/__test__/TestCases";
import {
  erbscheinAnfrageHappyPathData,
  mockBeguenstigtenArray,
} from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: ErbscheinAnfrageUserData = {
  ...erbscheinAnfrageHappyPathData,
  testamentArt: "none",
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
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
  widowedWithTestamentErbeCompletelyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        testamentArt: "erbvertrag",
        verstorbeneFamilienstand: "verwitwet",
        beguenstigten: mockBeguenstigtenArray,
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
      stepId: "/nachlass/grundbesitz/grundbesitz-frage",
    },
  ],
  widowedWithTestamentErbePartiallyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        testamentArt: "erbvertrag",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "no",
        verstorbeneFamilienstand: "verwitwet",
        beguenstigten: mockBeguenstigtenArray,
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
      stepId: "/angehoerige/hatte-kinder",
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
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
  divorcedWithTestamentErbeCompletelyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "geschieden",
        testamentArt: "handwritten",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/grundbesitz-frage",
    },
  ],
  divorcedWithTestamentErbePartiallyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
      userInput: {
        ...happyPathData,
        verstorbeneFamilienstand: "geschieden",
        testamentArt: "handwritten",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "no",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/hatte-kinder",
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
        spouseHasSameAddress: "yes",
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
      stepId: "/angehoerige/hatte-kinder",
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
        spouseHasSameAddress: "yes",
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
      stepId: "/angehoerige/hatte-kinder",
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
        spouseHasSameAddress: "no",
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
      stepId: "/angehoerige/hatte-kinder",
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
        spouseHasSameAddress: "no",
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
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
  marriedWithTestamentErbeCompletelyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hasEhevertrag: "no",
        testamentArt: "erbvertrag",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "yes",
        beguenstigten: mockBeguenstigtenArray,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
        spouseHasSameAddress: "yes",
        ehepartnerStaatsangehoerigkeit: "deutsch",
        ehepartnerHadSecondNationality: "no",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/grundbesitz-frage",
    },
  ],
  marriedWithTestamentErbePartiallyAllocated: [
    {
      stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hasEhevertrag: "no",
        testamentArt: "erbvertrag",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "no",
        beguenstigten: mockBeguenstigtenArray,
        verstorbeneFamilienstand: "verheiratet",
        ehepartnerVorname: "Max",
        ehepartnerNachname: "Mustermann",
        spouseHasSameAddress: "yes",
        ehepartnerStaatsangehoerigkeit: "deutsch",
        ehepartnerHadSecondNationality: "no",
      },
    },
    {
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
} satisfies FlowTestCases<ErbscheinAnfrageUserData>;
