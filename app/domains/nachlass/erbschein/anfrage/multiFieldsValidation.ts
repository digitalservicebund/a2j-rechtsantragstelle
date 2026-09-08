import {
  validateBirthDateBeforeDeathDate,
  validateDeathDateAfterBirthDate,
} from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { type MultiFieldsStepIdValidation } from "~/domains/types";

export const nachlassErbscheinAnfrageMultiFieldsValidation: MultiFieldsStepIdValidation =
  {
    "/verstorbene/geburtsdatum-ort": validateBirthDateBeforeDeathDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
    ),
    "/verstorbene/sterbedatum-ort": validateDeathDateAfterBirthDate(
      "verstorbeneGeburtsdatum",
      "sterbedatum",
    ),
    "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum":
      validateBirthDateBeforeDeathDate(
        "beguenstigten#geburtsdatum",
        "beguenstigten#sterbedatum",
      ),
    "/testament-oder-erbvertrag/beguenstigten/#/sterbedatum":
      validateDeathDateAfterBirthDate(
        "beguenstigten#geburtsdatum",
        "beguenstigten#sterbedatum",
      ),
  };
