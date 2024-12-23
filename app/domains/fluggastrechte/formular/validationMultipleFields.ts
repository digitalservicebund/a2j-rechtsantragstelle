import type { ValidationMultipleFieldsPathName } from "~/domains/validationsMultipleFields";
import { validateDepartureAfterArrival } from "./services/validation";

export const fluggastrechtValidationMultipleFields: ValidationMultipleFieldsPathName =
  {
    "/flugdaten/geplanter-flug": validateDepartureAfterArrival,
  };
