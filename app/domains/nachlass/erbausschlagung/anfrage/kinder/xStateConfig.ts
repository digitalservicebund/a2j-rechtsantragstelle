import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type GenericGuard } from "~/domains/guards.server";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

type NachlassErbausschlagungAnfrageDaten =
  GenericGuard<NachlassErbausschlagungAnfrageUserData>;

const kinderUnder18WohnortBeiAntragstellerYes: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinderUnder18 } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderWohnortBeiAntragsteller =
      kinderUnder18?.at(arrayIndex)?.wohnortBeiAntragsteller;
    return kinderWohnortBeiAntragsteller === "yes";
  };

const kinderUnder18NotFilled: NachlassErbausschlagungAnfrageDaten = ({
  context: { hasKid, numberOfKidsUnder18, kinderUnder18 },
}) => {
  if (hasKid === "no" || numberOfKidsUnder18 === 0) {
    return false;
  }

  return numberOfKidsUnder18 !== kinderUnder18?.length;
};

const kinderUnder18HasSorgerechtSameAddressNo: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinderUnder18 } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderHasSorgerechtSameAddress =
      kinderUnder18?.at(arrayIndex)?.hasSorgerechtSameAddress;
    return kinderHasSorgerechtSameAddress === "no";
  };

const kinderUnder18ShouldBackSorgerechtAddress: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinderUnder18 } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;

    const optionSorgerecht = getOptionSorgerecht({ pageData, kinderUnder18 });

    return (
      kinderUnder18?.at(arrayIndex)?.hasSorgerechtSameAddress === "no" &&
      optionSorgerecht === "shared"
    );
  };

const getOptionSorgerecht = ({
  pageData,
  kinderUnder18,
}: NachlassErbausschlagungAnfrageUserData) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return undefined;
  return kinderUnder18?.at(arrayIndex)?.optionSorgerecht;
};

export const kinderXStateConfig = {
  id: "kinder",
  initial: stepIds.kinderHasKid.relative,
  states: {
    [stepIds.kinderHasKid.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hasKid === "no",
            target: stepIds.abgabeWeitereInformation.absolute,
          },
          stepIds.kinderHowManyKids.relative,
        ],
        BACK: stepIds.ausschlagendePersonRelationToErblasser.absolute,
      },
    },
    [stepIds.kinderHowManyKids.relative]: {
      on: {
        SUBMIT: stepIds.kinderHowManyKidsUnder18.relative,
        BACK: stepIds.kinderHasKid.relative,
      },
    },
    [stepIds.kinderHowManyKidsUnder18.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.numberOfKidsUnder18 === 0,
            target: stepIds.kinderHowManyKidsOlder18.absolute,
          },
          stepIds.kinderUnder18Uebersicht.absolute,
        ],
        BACK: stepIds.kinderHowManyKids.relative,
      },
    },
    "kinder-unter-18": {
      id: "kinder-unter-18",
      initial: stepIds.kinderUnder18Uebersicht.relative,
      meta: { shouldAppearAsMenuNavigation: false },
      states: {
        [stepIds.kinderUnder18Uebersicht.relative]: {
          on: {
            SUBMIT: [
              {
                guard: kinderUnder18NotFilled,
                target: stepIds.kinderUnder18Warnung.relative,
              },
              stepIds.kinderHowManyKidsOlder18.absolute,
            ],
            BACK: stepIds.kinderHowManyKidsUnder18.absolute,
            "add-kinderUnder18": "kinder",
          },
        },
        warnung: {
          on: {
            BACK: stepIds.kinderUnder18Uebersicht.relative,
          },
        },
        [stepIds.kinderUnder18.relative]: {
          initial: "name",
          states: {
            name: {
              on: {
                BACK: stepIds.kinderUnder18Uebersicht.absolute,
                SUBMIT: "wohnort",
              },
            },
            wohnort: {
              on: {
                SUBMIT: [
                  {
                    guard: kinderUnder18WohnortBeiAntragstellerYes,
                    target: "sorgerecht",
                  },
                  "adresse",
                ],
                BACK: "name",
              },
            },
            adresse: {
              on: {
                SUBMIT: "sorgerecht",
                BACK: "wohnort",
              },
            },
            sorgerecht: {
              on: {
                SUBMIT: [
                  {
                    guard: ({ context }) =>
                      getOptionSorgerecht(context) === "yes",
                    target: "erbe-ausschlagende",
                  },
                  {
                    guard: ({ context }) =>
                      getOptionSorgerecht(context) === "anotherOrganization",
                    target: "sorgerecht-organisation-name",
                  },
                  "sorgerecht-person",
                ],
                BACK: [
                  {
                    guard: kinderUnder18WohnortBeiAntragstellerYes,
                    target: "wohnort",
                  },
                  "adresse",
                ],
              },
            },
            "sorgerecht-person": {
              on: {
                SUBMIT: "sorgerecht-gleiche-address",
                BACK: "sorgerecht",
              },
            },
            "sorgerecht-gleiche-address": {
              on: {
                SUBMIT: [
                  {
                    guard: kinderUnder18HasSorgerechtSameAddressNo,
                    target: "sorgerecht-adresse",
                  },
                  {
                    guard: ({ context }) =>
                      getOptionSorgerecht(context) === "anotherPerson",
                    target: stepIds.kinderUnder18Uebersicht.absolute,
                  },
                  "erbe-ausschlagende",
                ],
                BACK: "sorgerecht-person",
              },
            },
            "sorgerecht-adresse": {
              on: {
                SUBMIT: [
                  {
                    guard: ({ context }) =>
                      getOptionSorgerecht(context) === "anotherPerson",
                    target: stepIds.kinderUnder18Uebersicht.absolute,
                  },
                  "erbe-ausschlagende",
                ],
                BACK: "sorgerecht-gleiche-address",
              },
            },
            "sorgerecht-organisation-name": {
              on: {
                SUBMIT: "sorgerecht-organisation-adresse",
                BACK: "sorgerecht",
              },
            },
            "sorgerecht-organisation-adresse": {
              on: {
                SUBMIT: stepIds.kinderUnder18Uebersicht.absolute,
                BACK: "sorgerecht-organisation-name",
              },
            },
            "erbe-ausschlagende": {
              on: {
                SUBMIT: stepIds.kinderUnder18Uebersicht.absolute,
                BACK: [
                  {
                    guard: kinderUnder18ShouldBackSorgerechtAddress,
                    target: "sorgerecht-adresse",
                  },
                  {
                    guard: ({ context }) =>
                      getOptionSorgerecht(context) === "shared",
                    target: "sorgerecht-gleiche-address",
                  },
                  "sorgerecht",
                ],
              },
            },
          },
        },
      },
    },
    [stepIds.kinderHowManyKidsOlder18.relative]: {
      on: {
        SUBMIT: stepIds.abgabeWeitereInformation.absolute,
        BACK: [
          {
            guard: ({ context }) =>
              context.numberOfKidsUnder18 !== undefined &&
              context.numberOfKidsUnder18 > 0,
            target: stepIds.kinderUnder18Uebersicht.absolute,
          },
          stepIds.kinderHowManyKidsUnder18.relative,
        ],
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
