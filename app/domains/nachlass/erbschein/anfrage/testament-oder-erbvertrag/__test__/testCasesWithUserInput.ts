import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
};

export const testamentOderErbvertragTestCases = {
  noTestamentOrErbvertragSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "ledig",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  noTestamentOrErbvertragNotSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "verheiratet",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
    },
  ],
  testamentNoBeneficiariesNamed: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "erbvertrag",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/warnung",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
