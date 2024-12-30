import type { ValidationMultipleFieldsPathName } from "~/domains/validationsMultipleFields";
import {
  validateAnotherFlightPage,
  validateDepartureAfterArrival,
  validateReplacementConnectionPage,
  validateSameFlightPage,
} from "./services/validation";

export const fluggastrechtValidationMultipleFields: ValidationMultipleFieldsPathName =
  {
    "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
    "/flugdaten/tatsaechlicher-flug-ankunft": validateSameFlightPage,
    "/flugdaten/anderer-flug-ankunft": validateAnotherFlightPage,
    "/flugdaten/ersatzverbindung-beschreibung":
      validateReplacementConnectionPage,
  };
