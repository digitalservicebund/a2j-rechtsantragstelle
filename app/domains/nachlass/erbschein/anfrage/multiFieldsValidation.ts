import {
  validateBirthDate,
  validateDeathDate,
} from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { type MultiFieldsStepIdValidation } from "~/domains/types";

const buildKinderMultiFieldsValidation = (): MultiFieldsStepIdValidation => {
  const kinderMultiFieldsValidation: MultiFieldsStepIdValidation = {};

  for (let idx = 1; idx <= 5; idx++) {
    const path = `/kinder/#`.repeat(idx);
    const fieldName = `kinder#`.repeat(idx);

    kinderMultiFieldsValidation[`/angehoerige${path}/geburtsdatum`] =
      validateBirthDate(`${fieldName}geburtsdatum`, `${fieldName}sterbedatum`);

    kinderMultiFieldsValidation[`/angehoerige${path}/sterbedatum`] =
      validateDeathDate(`${fieldName}geburtsdatum`, `${fieldName}sterbedatum`);
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
      ] = validateBirthDate(
        `${fieldName}geburtsdatum`,
        `${fieldName}sterbedatum`,
      );

      elternteilKinderMultiFieldsValidation[`/angehoerige${path}/sterbedatum`] =
        validateDeathDate(
          `${fieldName}geburtsdatum`,
          `${fieldName}sterbedatum`,
        );
    }

    return elternteilKinderMultiFieldsValidation;
  };

export const erbscheinAnfrageMultiFieldsValidation: MultiFieldsStepIdValidation =
  {
    "/verstorbene/geburtsdatum-ort": validateBirthDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
    ),
    "/verstorbene/sterbedatum-ort": validateDeathDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
    ),
    "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum":
      validateBirthDate(
        "beguenstigten#geburtsdatum",
        "beguenstigten#sterbedatum",
      ),
    "/testament-oder-erbvertrag/beguenstigten/#/sterbedatum": validateDeathDate(
      "beguenstigten#geburtsdatum",
      "beguenstigten#sterbedatum",
    ),
    ...buildKinderMultiFieldsValidation(),
    "/angehoerige/elternteile/#/geburtsdatum": validateBirthDate(
      "elternteile#geburtsdatum",
      "elternteile#sterbedatum",
    ),
    "/angehoerige/elternteile/#/sterbedatum": validateDeathDate(
      "elternteile#geburtsdatum",
      "elternteile#sterbedatum",
    ),
    ...buildElternteilKinderMultiFieldsValidation(),
    "/angehoerige/#/geburtsdatum": validateBirthDate(
      "angehoerige#geburtsdatum",
      "angehoerige#sterbedatum",
    ),
    "/angehoerige/#/sterbedatum": validateDeathDate(
      "angehoerige#geburtsdatum",
      "angehoerige#sterbedatum",
    ),
  };
