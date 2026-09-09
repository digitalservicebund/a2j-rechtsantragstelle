import { validateBirthDateDeathDate } from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { type MultiFieldsStepIdValidation } from "~/domains/types";

const buildKinderMultiFieldsValidation = (): MultiFieldsStepIdValidation => {
  const kinderMultiFieldsValidation: MultiFieldsStepIdValidation = {};

  for (let idx = 1; idx <= 5; idx++) {
    const path = `/kinder/#`.repeat(idx);
    const fieldName = `kinder#`.repeat(idx);

    kinderMultiFieldsValidation[`/angehoerige${path}/geburtsdatum`] =
      validateBirthDateDeathDate(
        `${fieldName}geburtsdatum`,
        `${fieldName}sterbedatum`,
        "birthDate",
      );

    kinderMultiFieldsValidation[`/angehoerige${path}/sterbedatum`] =
      validateBirthDateDeathDate(
        `${fieldName}geburtsdatum`,
        `${fieldName}sterbedatum`,
        "deathDate",
      );
  }

  return kinderMultiFieldsValidation;
};

const buildElternteilKinderMultiFieldsValidation =
  (): MultiFieldsStepIdValidation => {
    const elternteilKinderMultiFieldsValidation: MultiFieldsStepIdValidation =
      {};

    for (let idx = 1; idx <= 5; idx++) {
      const path = `/elternteile/#${"/kinder/#".repeat(idx)}`;
      const fieldName = `elternteile#${"kinder#".repeat(idx)}`;

      elternteilKinderMultiFieldsValidation[
        `/angehoerige${path}/geburtsdatum`
      ] = validateBirthDateDeathDate(
        `${fieldName}geburtsdatum`,
        `${fieldName}sterbedatum`,
        "birthDate",
      );

      elternteilKinderMultiFieldsValidation[`/angehoerige${path}/sterbedatum`] =
        validateBirthDateDeathDate(
          `${fieldName}geburtsdatum`,
          `${fieldName}sterbedatum`,
          "deathDate",
        );
    }

    return elternteilKinderMultiFieldsValidation;
  };

export const erbscheinAnfrageMultiFieldsValidation: MultiFieldsStepIdValidation =
  {
    "/verstorbene/geburtsdatum-ort": validateBirthDateDeathDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
      "birthDate",
    ),
    "/verstorbene/sterbedatum-ort": validateBirthDateDeathDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
      "deathDate",
    ),
    "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum":
      validateBirthDateDeathDate(
        "beguenstigten#geburtsdatum",
        "beguenstigten#sterbedatum",
        "birthDate",
      ),
    "/testament-oder-erbvertrag/beguenstigten/#/sterbedatum":
      validateBirthDateDeathDate(
        "beguenstigten#geburtsdatum",
        "beguenstigten#sterbedatum",
        "deathDate",
      ),
    ...buildKinderMultiFieldsValidation(),
    "/angehoerige/elternteile/#/geburtsdatum": validateBirthDateDeathDate(
      "elternteile#geburtsdatum",
      "elternteile#sterbedatum",
      "birthDate",
    ),
    "/angehoerige/elternteile/#/sterbedatum": validateBirthDateDeathDate(
      "elternteile#geburtsdatum",
      "elternteile#sterbedatum",
      "deathDate",
    ),
    ...buildElternteilKinderMultiFieldsValidation(),
    "/angehoerige/#/geburtsdatum": validateBirthDateDeathDate(
      "angehoerige#geburtsdatum",
      "angehoerige#sterbedatum",
      "birthDate",
    ),
    "/angehoerige/#/sterbedatum": validateBirthDateDeathDate(
      "angehoerige#geburtsdatum",
      "angehoerige#sterbedatum",
      "deathDate",
    ),
  };
