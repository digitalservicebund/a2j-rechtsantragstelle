import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungGerichtFindenUserData } from "../userData";
import { nachlassErbausschlagungGerichtFindenXstateConfig } from "~/domains/nachlass/erbausschlagung/gericht-finden/xStateConfig";

export const nachlassErbausschlagungGerichtFindenTestCases = {
  xstateConfig: nachlassErbausschlagungGerichtFindenXstateConfig,
  testcases: {
    auslandLebensmittelpunkt: [
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
        stepId: "/plz",
        userInput: {
          plz: "12437",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    auslandLebensmittelpunktEdgeCase: [
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
        stepId: "/plz",
        userInput: {
          plz: "20457",
        },
      },
      {
        stepId: "/verschiedene-zustaendige-gerichte",
        userInput: {
          strasse: "Teststraße",
          hausnummer: "1",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    deutschlandLebensmittelpunktCourtNearMe: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearMe",
        },
      },
      {
        stepId: "/plz",
        userInput: {
          plz: "10115",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    deutschlandLebensmittelpunktCourtNearMeEdgeCase: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearMe",
        },
      },
      {
        stepId: "/plz",
        userInput: {
          plz: "20457",
        },
      },
      {
        stepId: "/verschiedene-zustaendige-gerichte",
        userInput: {
          strasse: "Teststraße",
          hausnummer: "1",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    pflegeheim: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "yes",
        },
      },
      {
        stepId: "/plz-pflegeheim",
        userInput: {
          plzPflegeheim: "12437",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    pflegeheimEdgeCase: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "yes",
        },
      },
      {
        stepId: "/plz-pflegeheim",
        userInput: {
          plzPflegeheim: "20457",
        },
      },
      {
        stepId: "/verschiedene-zustaendige-gerichte",
        userInput: {
          strasse: "Teststraße",
          hausnummer: "1",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    hospiz: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "no",
        },
      },
      {
        stepId: "/hospiz",
        userInput: {
          hospiz: "yes",
        },
      },
      {
        stepId: "/plz-hospiz",
        userInput: {
          plzHospiz: "12437",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    hospizEdgeCase: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "no",
        },
      },
      {
        stepId: "/hospiz",
        userInput: {
          hospiz: "yes",
        },
      },
      {
        stepId: "/plz-hospiz",
        userInput: {
          plzHospiz: "20457",
        },
      },
      {
        stepId: "/verschiedene-zustaendige-gerichte",
        userInput: {
          strasse: "Teststraße",
          hausnummer: "1",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    lebensmittelpunkt: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "no",
        },
      },
      {
        stepId: "/hospiz",
        userInput: {
          hospiz: "no",
        },
      },
      {
        stepId: "/plz-lebensmittelpunkt",
        userInput: {
          plzLebensmittelpunkt: "12437",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
    lebensmittelpunktEdgeCase: [
      {
        stepId: "/start",
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/wo-ausschlagen",
        userInput: {
          ausschlagungsOrt: "courtNearDeceased",
        },
      },
      {
        stepId: "/pflegeheim",
        userInput: {
          pflegeheim: "no",
        },
      },
      {
        stepId: "/hospiz",
        userInput: {
          hospiz: "no",
        },
      },
      {
        stepId: "/plz-lebensmittelpunkt",
        userInput: {
          plzLebensmittelpunkt: "20457",
        },
      },
      {
        stepId: "/verschiedene-zustaendige-gerichte",
        userInput: {
          strasse: "Teststraße",
          hausnummer: "1",
        },
      },
      {
        stepId: "/ergebnis/gericht-ermittelt",
      },
    ],
  } satisfies FlowTestCases<NachlassErbausschlagungGerichtFindenUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungGerichtFindenUserData>;
