import { type FlowTestCases } from "~/domains/__test__/TestCases";
import {
  mockBeguenstigtenArray,
  nachlassErbscheinAnfrageHappyPathData,
} from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
  testamentArt: "handwritten",
  verstorbeneFamilienstand: "ledig",
  beguenstigten: mockBeguenstigtenArray,
};

export const nachlassTestCases = {
  grundbesitzNotEntered: [
    {
      stepId: "/nachlass/grundbesitz-frage",
      userInput: {
        ...happyPathData,
        hasGrundbesitz: "yes",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/uebersicht",
    },
    {
      stepId: "/nachlass/grundbesitz/warnung",
    },
    {
      stepId: "/nachlass/grundbesitz/uebersicht",
    },
  ],
  hasGrundbesitz: [
    {
      stepId: "/nachlass/grundbesitz-frage",
      userInput: {
        ...happyPathData,
        hasGrundbesitz: "yes",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/uebersicht",
      addArrayItemEvent: "add-grundbesitz",
    },
    {
      stepId: "/nachlass/grundbesitz/#/adresse",
      userInput: {
        "grundbesitz#strasse": "Musterstraße",
        "grundbesitz#hausnummer": "1",
        "grundbesitz#plz": "12345",
        "grundbesitz#ort": "Musterstadt",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        grundbesitz: [
          {
            strasse: "Musterstraße",
            hausnummer: "1",
            plz: "12345",
            ort: "Musterstadt",
          },
        ],
      },
    },
    {
      stepId: "/nachlass/unternehmen-frage",
    },
  ],
  unternehmenNotEntered: [
    {
      stepId: "/nachlass/unternehmen-frage",
      userInput: {
        ...happyPathData,
        hasUnternehmen: "yes",
      },
    },
    {
      stepId: "/nachlass/unternehmen/uebersicht",
    },
    {
      stepId: "/nachlass/unternehmen/warnung",
    },
    {
      stepId: "/nachlass/unternehmen/uebersicht",
    },
  ],
  hasUnternehmen: [
    {
      stepId: "/nachlass/unternehmen-frage",
      userInput: {
        ...happyPathData,
        hasUnternehmen: "yes",
      },
    },
    {
      stepId: "/nachlass/unternehmen/uebersicht",
      addArrayItemEvent: "add-unternehmen",
    },
    {
      stepId: "/nachlass/unternehmen/#/name",
      userInput: {
        "unternehmen#firmenname": "Musterfirma GmbH",
      },
    },
    {
      stepId: "/nachlass/unternehmen/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        unternehmen: [
          {
            firmenname: "Musterfirma GmbH",
          },
        ],
      },
    },
    {
      stepId: "/nachlass/vermoegen-frage",
    },
  ],
  hasVermoegen: [
    {
      stepId: "/nachlass/vermoegen-frage",
      userInput: {
        ...happyPathData,
        hasVermoegen: "yes",
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
  noVermoegen: [
    {
      stepId: "/nachlass/vermoegen-frage",
      userInput: {
        ...happyPathData,
        hasVermoegen: "no",
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
  unknownVermoegen: [
    {
      stepId: "/nachlass/vermoegen-frage",
      userInput: {
        ...happyPathData,
        hasVermoegen: "unknown",
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
