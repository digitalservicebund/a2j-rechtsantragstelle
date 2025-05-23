import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const rsvCoverage = z.enum(
  ["yes", "no", "partly", "unknown"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeRsvInputSchema = {
  hasRsv: YesNoAnswer,
  hasRsvCoverage: rsvCoverage,
  hasRsvThroughOrg: YesNoAnswer,
  hasOrgCoverage: rsvCoverage,
};

const _partialSchema = z.object(prozesskostenhilfeRsvInputSchema).partial();
export type ProzesskostenhilfeRechtsschutzversicherungUserData = z.infer<
  typeof _partialSchema
>;
