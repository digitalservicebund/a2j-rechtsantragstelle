import type { MultiFieldsStepIdValidation } from "~/domains/multiFieldsFlowValidation";
import { validateSameDepartureAndArrivalAirports } from "./services/validation";

export const fluggastrechtVorabcheckMultiFieldsValidation: MultiFieldsStepIdValidation =
  {
    "/flughaefen": validateSameDepartureAndArrivalAirports,
  };
