import type { MultiFieldsStepIdValidation } from "~/domains/types";
import { validateSameDepartureAndArrivalAirports } from "./services/validation";
import { fluggastrechteVorabcheckPages } from "./pages";

const _schema = fluggastrechteVorabcheckPages.flughaefen.pageSchema;

export const fluggastrechtVorabcheckMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/flughaefen": validateSameDepartureAndArrivalAirports,
};
