import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  gegenWenBeklagen: "person",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
      "/gericht-pruefen/klagende-person": true,
      "/gericht-pruefen/beklagte-person": true,
    },
  },
};

const initialDefaultStep = (
  userInputStepData: GeldEinklagenFormularUserData,
): Array<ExpectedStep<GeldEinklagenFormularUserData>> => [
  {
    stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
    userInput: {
      ...baseContext,
      ...userInputStepData,
    },
    skipPageSchemaValidation: true,
  },
];

export const testCasesWithUserInputBeklagtePerson: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    beklagtePersonMieteAndVertragAndRaumeYes: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "yes",
      }),
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      },
    ],
    beklagtePersonMieteAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
        userInput: {
          gerichtsstandsvereinbarung: "yes",
        },
      },
      {
        stepId:
          "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      },
    ],
    beklagtePersonMieteAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "yes",
        },
      },
      {
        stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
        userInput: {
          gerichtsstandsvereinbarung: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonMieteAndBeklagteKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonMieteAndBeklagteKaufmannUnknown: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "unknown",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonMieteAndKlagendeVerbraucherYes: [
      ...initialDefaultStep({
        sachgebiet: "miete",
        mietePachtVertrag: "yes",
        mietePachtRaum: "no",
        klagendeVerbraucher: "yes",
      }),
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaAnderesRechtsproblemAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes:
      [
        ...initialDefaultStep({
          sachgebiet: "anderesRechtsproblem",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        },
      ],
    beklagtePersonaAnderesRechtsproblemAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo:
      [
        ...initialDefaultStep({
          sachgebiet: "anderesRechtsproblem",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonAnderesRechtsproblemAndBeklagteKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "anderesRechtsproblem",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonAnderesRechtsproblemAndBeklagteKaufmannUnknown: [
      ...initialDefaultStep({
        sachgebiet: "anderesRechtsproblem",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "unknown",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonAnderesRechtsproblemAndKlagendeVerbraucherYes: [
      ...initialDefaultStep({
        sachgebiet: "anderesRechtsproblem",
        klagendeVerbraucher: "yes",
      }),
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaSchadenAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes:
      [
        ...initialDefaultStep({
          sachgebiet: "schaden",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        },
      ],
    beklagtePersonaSchadenAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo:
      [
        ...initialDefaultStep({
          sachgebiet: "schaden",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaSchadenAndBeklagteKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "schaden",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaSchadenAndBeklagteKaufmannUnknown: [
      ...initialDefaultStep({
        sachgebiet: "schaden",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "unknown",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaSchadenAndKlagendeVerbraucherYes: [
      ...initialDefaultStep({
        sachgebiet: "schaden",
        klagendeVerbraucher: "yes",
      }),
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaVersicherungAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes:
      [
        ...initialDefaultStep({
          sachgebiet: "versicherung",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        },
      ],
    beklagtePersonaVersicherungAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo:
      [
        ...initialDefaultStep({
          sachgebiet: "versicherung",
          klagendeKaufmann: "yes",
          klagendeVerbraucher: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaVersicherungAndBeklagteKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "versicherung",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaVersicherungAndBeklagteKaufmannUnknown: [
      ...initialDefaultStep({
        sachgebiet: "versicherung",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "unknown",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaVersicherungAndKlagendeVerbraucherYes: [
      ...initialDefaultStep({
        sachgebiet: "versicherung",
        klagendeVerbraucher: "yes",
      }),
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenYesAndKlagendeKaufmannNo:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeKaufmann: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenNoAndKlagendeKaufmannNo:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeKaufmann: "no",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenYesAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        },
      ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenYesAndBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenYesAndBeklagteKaufmannNo:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenPersonWithGeldVerdienenYesAndBeklagteKaufmannUnknown:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/geld-verdienen",
          userInput: {
            beklagtePersonGeldVerdienen: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "unknown",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenOrganisationKlagendeKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "urheberrecht",
        klagendeKaufmann: "no",
        gegenWenBeklagen: "organisation",
      }),

      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaUrheberrechtGegenOrganisationWithBeklagteKaufmannYesAndGerichtsstandsvereinbarungYes:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
          gegenWenBeklagen: "organisation",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "yes",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
        },
      ],
    beklagtePersonaUrheberrechtGegenOrganisationWithBeklagteKaufmannYesAndGerichtsstandsvereinbarungNo:
      [
        ...initialDefaultStep({
          sachgebiet: "urheberrecht",
          klagendeVerbraucher: "no",
          klagendeKaufmann: "yes",
          gegenWenBeklagen: "organisation",
        }),
        {
          stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          userInput: {
            beklagtePersonKaufmann: "yes",
          },
        },
        {
          stepId: "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
          userInput: {
            gerichtsstandsvereinbarung: "no",
          },
        },
        {
          stepId:
            "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
        },
      ],
    beklagtePersonaUrheberrechtGegenOrganisationWithBeklagteKaufmannNo: [
      ...initialDefaultStep({
        sachgebiet: "urheberrecht",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
        gegenWenBeklagen: "organisation",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "no",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
    beklagtePersonaUrheberrechtGegenOrganisationWithBeklagteKaufmannUnknown: [
      ...initialDefaultStep({
        sachgebiet: "urheberrecht",
        klagendeVerbraucher: "no",
        klagendeKaufmann: "yes",
        gegenWenBeklagen: "organisation",
      }),
      {
        stepId: "/gericht-pruefen/beklagte-person/kaufmann",
        userInput: {
          beklagtePersonKaufmann: "unknown",
        },
      },
      {
        stepId: "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      },
    ],
  };
