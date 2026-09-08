import { validateBirthDateDeathDate } from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { type MultiFieldsStepIdValidation } from "~/domains/types";

export const nachlassErbscheinAnfrageMultiFieldsValidation: MultiFieldsStepIdValidation =
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
