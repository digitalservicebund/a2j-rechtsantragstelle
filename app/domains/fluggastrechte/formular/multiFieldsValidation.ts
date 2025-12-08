import { type MultiFieldsStepIdValidation } from "~/domains/types";
import { validateAnotherFlightPage } from "./services/validation/validateAnotherFlightPage";
import { validateCancelFlightReplacementPage } from "./services/validation/validateCancelFlightReplacementPage";
import { validateDepartureAfterArrival } from "./services/validation/validateDepartureAfterArrival";
import { validateReplacementConnectionPage } from "./services/validation/validateReplacementConnectionPage";
import { validateSameFlightPage } from "./services/validation/validateSameFlightPage";
import { validateStopoverDuplicates } from "./services/validation/validateStopoverDuplicates";
import { fluggastrechteFlugdatenPages } from "./flugdaten/pages";

const _schema = Object.assign(
  {},
  ...Object.values(fluggastrechteFlugdatenPages)
    .filter(({ pageSchema }) => pageSchema != undefined)
    .map(({ pageSchema }) => pageSchema),
);

export const fluggastrechtMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
  "/flugdaten/tatsaechlicher-flug-ankunft": validateSameFlightPage,
  "/flugdaten/anderer-flug-ankunft": validateAnotherFlightPage,
  "/flugdaten/ersatzverbindung-beschreibung": validateReplacementConnectionPage,
  "/flugdaten/ersatzverbindung-daten": validateCancelFlightReplacementPage,
  "/flugdaten/zwischenstopp-uebersicht-1": validateStopoverDuplicates,
  "/flugdaten/zwischenstopp-uebersicht-2": validateStopoverDuplicates,
  "/flugdaten/zwischenstopp-uebersicht-3": validateStopoverDuplicates,
};
