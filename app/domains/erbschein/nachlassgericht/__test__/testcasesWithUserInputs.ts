import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { type ErbscheinNachlassGerichtUserData } from "~/domains/erbschein/nachlassgericht/userData";
import { erbscheinNachlassgerichtXstateConfig } from "~/domains/erbschein/nachlassgericht/xStateConfig";

export const erbscheinNachlassgerichtTestCases = {
  xstateConfig: erbscheinNachlassgerichtXstateConfig,
  testcases: {
    auslaendischeErbfall: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "ausland",
        },
      },
      {
        stepId: "/ergebnis/auslaendische-erbfaelle",
      },
    ],
    pflegeheim: [
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wohnsituation-pflegeheim",
        userInput: {
          wohnsituationPflegeheim: "yes",
        },
      },
      {
        stepId: "/plz-pflegeheim",
        userInput: {
          plzPflegeheim: "10969",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
    pflegeheimAmbiguousPLZ: [
      {
        stepId: "/plz-pflegeheim",
        userInput: {
          plzPflegeheim: "20457",
        },
      },
      {
        stepId: "/strasse-hausnummer",
        userInput: {
          strasse: "Musterstrasse",
          houseNumber: "1",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
    hospiz: [
      {
        stepId: "/wohnsituation-pflegeheim",
        userInput: {
          wohnsituationPflegeheim: "no",
        },
      },
      {
        stepId: "/wohnsituation-hospiz",
        userInput: {
          wohnsituationHospiz: "yes",
        },
      },
      {
        stepId: "/plz-hospiz",
        userInput: {
          plzHospiz: "10969",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
    hospizAmbiguousPLZ: [
      {
        stepId: "/plz-hospiz",
        userInput: {
          plzHospiz: "20457",
          wohnsituationHospiz: "yes",
        },
      },
      {
        stepId: "/strasse-hausnummer",
        userInput: {
          strasse: "Musterstrasse",
          houseNumber: "1",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
    wohnungOrHaus: [
      {
        stepId: "/wohnsituation-hospiz",
        userInput: {
          wohnsituationHospiz: "no",
        },
      },
      {
        stepId: "/plz-lebensmittelpunkt",
        userInput: {
          plzLebensmittelpunkt: "10969",
          wohnsituationHospiz: "no",
          wohnsituationPflegeheim: "no",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
    wohnungOrHausAmbiguousPLZ: [
      {
        stepId: "/plz-lebensmittelpunkt",
        userInput: {
          plzLebensmittelpunkt: "20457",
          wohnsituationHospiz: "no",
          wohnsituationPflegeheim: "no",
        },
      },
      {
        stepId: "/strasse-hausnummer",
        userInput: {
          strasse: "Musterstrasse",
          houseNumber: "1",
        },
      },
      {
        stepId: "/ergebnis/nachlassgericht",
      },
    ],
  },
} satisfies FlowTestConfig<ErbscheinNachlassGerichtUserData>;
