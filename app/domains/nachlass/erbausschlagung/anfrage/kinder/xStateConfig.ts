import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type GenericGuard } from "~/domains/guards.server";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { toDate } from "~/services/validation/dateObject";
import { addYears, today } from "~/util/date";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

type NachlassErbausschlagungAnfrageDaten =
  GenericGuard<NachlassErbausschlagungAnfrageUserData>;

const isKinderWohnortBeiAntragstellerYes: NachlassErbausschlagungAnfrageDaten =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderWohnortBeiAntragsteller =
      kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
    return kinderWohnortBeiAntragsteller === "yes";
  };

const isKinderAbove18YearsOld: NachlassErbausschlagungAnfrageDaten = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const currentKid = kinder?.at(arrayIndex);
  if (!currentKid?.geburtsdatum) return false;

  const birthDate = toDate(currentKid.geburtsdatum);
  if (Number.isNaN(birthDate.getTime())) return false;

  const eighteenYearsAgo = addYears(today(), -18);

  return birthDate <= eighteenYearsAgo;
};

const kinderNotFilled: NachlassErbausschlagungAnfrageDaten = ({
  context: { hasKid, numberOfKids, kinder },
}) => {
  if (hasKid === "no" || numberOfKids === 0) {
    return false;
  }

  return numberOfKids !== kinder?.length;
};

const hasKinderSorgerechtSameAddressNo: NachlassErbausschlagungAnfrageDaten = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kinderHasSorgerechtSameAddress =
    kinder?.at(arrayIndex)?.hasSorgerechtSameAddress;
  return kinderHasSorgerechtSameAddress === "no";
};

const shouldBackSorgerechtAddress: NachlassErbausschlagungAnfrageDaten = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;

  const optionSorgerecht = getOptionSorgerecht({ pageData, kinder });

  return (
    kinder?.at(arrayIndex)?.hasSorgerechtSameAddress === "no" &&
    optionSorgerecht === "shared"
  );
};

const getOptionSorgerecht = ({
  pageData,
  kinder,
}: NachlassErbausschlagungAnfrageUserData) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return undefined;
  return kinder?.at(arrayIndex)?.optionSorgerecht;
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
        SUBMIT: stepIds.kinderUebersicht.relative,
        BACK: stepIds.kinderHasKid.relative,
      },
    },
    [stepIds.kinderUebersicht.relative]: {
      on: {
        SUBMIT: [
          {
            guard: kinderNotFilled,
            target: stepIds.kinderWarnung.relative,
          },
          stepIds.abgabeWeitereInformation.absolute,
        ],
        BACK: stepIds.kinderHowManyKids.relative,
        "add-kinder": "kinder",
      },
    },
    [stepIds.kinderWarnung.relative]: {
      on: {
        BACK: stepIds.kinderUebersicht.relative,
      },
    },
    [stepIds.kinder.relative]: {
      initial: "name",
      meta: { shouldAppearAsMenuNavigation: false },
      states: {
        name: {
          on: {
            BACK: "#kinder.uebersicht",
            SUBMIT: "wohnort",
          },
        },
        wohnort: {
          on: {
            SUBMIT: [
              {
                guard: (context) =>
                  isKinderWohnortBeiAntragstellerYes(context) &&
                  isKinderAbove18YearsOld(context),
                target: "#kinder.uebersicht",
              },
              {
                guard: isKinderWohnortBeiAntragstellerYes,
                target: "sorgerecht",
              },
              "adresse",
            ],
            BACK: "name",
          },
        },
        adresse: {
          on: {
            SUBMIT: [
              {
                guard: isKinderAbove18YearsOld,
                target: "#kinder.uebersicht",
              },
              "sorgerecht",
            ],
            BACK: "wohnort",
          },
        },
        sorgerecht: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => getOptionSorgerecht(context) === "yes",
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
                guard: isKinderWohnortBeiAntragstellerYes,
                target: "wohnort",
              },
              "adresse",
            ],
          },
        },
        "sorgerecht-person": {
          on: {
            SUBMIT: "sorgerecht-gleiche-adresse",
            BACK: "sorgerecht",
          },
        },
        "sorgerecht-gleiche-adresse": {
          on: {
            SUBMIT: [
              {
                guard: hasKinderSorgerechtSameAddressNo,
                target: "sorgerecht-adresse",
              },
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "anotherPerson",
                target: "#kinder.uebersicht",
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
                target: "#kinder.uebersicht",
              },
              "erbe-ausschlagende",
            ],
            BACK: "sorgerecht-gleiche-adresse",
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
            SUBMIT: "#kinder.uebersicht",
            BACK: "sorgerecht-organisation-name",
          },
        },
        "erbe-ausschlagende": {
          on: {
            SUBMIT: "#kinder.uebersicht",
            BACK: [
              {
                guard: shouldBackSorgerechtAddress,
                target: "sorgerecht-adresse",
              },
              {
                guard: ({ context }) =>
                  getOptionSorgerecht(context) === "shared",
                target: "sorgerecht-gleiche-adresse",
              },
              "sorgerecht",
            ],
          },
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
