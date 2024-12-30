import type { MultipleFieldsStepIdValidation } from "~/domains/multipleFieldsFlowValidation";
import {
  validateAnotherFlightPage,
  validateDepartureAfterArrival,
  validateReplacementConnectionPage,
  validateSameFlightPage,
} from "./services/validation";

export const fluggastrechtMultipleFieldsValidation: MultipleFieldsStepIdValidation =
  {
    "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
    "/flugdaten/tatsaechlicher-flug-ankunft": validateSameFlightPage,
    "/flugdaten/anderer-flug-ankunft": validateAnotherFlightPage,
    "/flugdaten/ersatzverbindung-beschreibung":
      validateReplacementConnectionPage,
  };
