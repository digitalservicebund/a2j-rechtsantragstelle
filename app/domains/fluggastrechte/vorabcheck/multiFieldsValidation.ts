import type { MultiFieldsStepIdValidation } from "~/domains/types";
import { validateSameDepartureAndArrivalAirports } from "./services/validation";
import type { fluggastrechteVorabcheckInputSchema } from "./userData";

export const fluggastrechtVorabcheckMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof fluggastrechteVorabcheckInputSchema
> = {
  "/flughaefen": validateSameDepartureAndArrivalAirports,
};
