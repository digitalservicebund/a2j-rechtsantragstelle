import type { MultiFieldsStepIdValidation } from "~/domains/multiFieldsFlowValidation";
import {
  validateAnotherFlightPage,
  validateDepartureAfterArrival,
  validateCancelFlightReplacementPage,
  validateReplacementConnectionPage,
  validateSameFlightPage,
} from "./services/validation";

export const fluggastrechtMultiFieldsValidation: MultiFieldsStepIdValidation = {
  "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
  "/flugdaten/tatsaechlicher-flug-ankunft": validateSameFlightPage,
  "/flugdaten/anderer-flug-ankunft": validateAnotherFlightPage,
  "/flugdaten/ersatzverbindung-beschreibung": validateReplacementConnectionPage,
  "/flugdaten/ersatzverbindung-daten": validateCancelFlightReplacementPage,
};
