import type { MultiFieldsStepIdValidation } from "~/domains/types";
import { validateSameDepartureAndArrivalAirports } from "./services/validation";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";

const _schema = getAllPageSchemaByFlowId("/fluggastrechte/vorabcheck");

export const fluggastrechtVorabcheckMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/flughaefen": validateSameDepartureAndArrivalAirports,
};
