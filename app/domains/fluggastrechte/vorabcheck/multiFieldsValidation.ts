import type { MultiFieldsStepIdValidation } from "~/domains/types";
import { validateSameDepartureAndArrivalAirports } from "./services/validation";

export const fluggastrechtVorabcheckMultiFieldsValidation: MultiFieldsStepIdValidation =
  {
    "/flughaefen": validateSameDepartureAndArrivalAirports,
  };
