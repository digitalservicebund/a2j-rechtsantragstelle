import { type MultiFieldsStepIdValidation } from "~/domains/types";
import { validateAnotherFlightPage } from "./services/validation/validateAnotherFlightPage";
import { validateCancelFlightReplacementPage } from "./services/validation/validateCancelFlightReplacementPage";
import { validateDepartureAfterArrival } from "./services/validation/validateDepartureAfterArrival";
import { validateReplacementConnectionPage } from "./services/validation/validateReplacementConnectionPage";
import { validateSameFlightPage } from "./services/validation/validateSameFlightPage";
import { validateStopoverDuplicates } from "./services/validation/validateStopoverDuplicates";

export const fluggastrechtMultiFieldsValidation: MultiFieldsStepIdValidation = {
  "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
  "/flugdaten/tatsaechlicher-flug-ankunft": validateSameFlightPage,
  "/flugdaten/anderer-flug-ankunft": validateAnotherFlightPage,
  "/flugdaten/ersatzverbindung-beschreibung": validateReplacementConnectionPage,
  "/flugdaten/ersatzverbindung-daten": validateCancelFlightReplacementPage,
  "/flugdaten/zwischenstopp-uebersicht-1": validateStopoverDuplicates,
  "/flugdaten/zwischenstopp-uebersicht-2": validateStopoverDuplicates,
  "/flugdaten/zwischenstopp-uebersicht-3": validateStopoverDuplicates,
};
