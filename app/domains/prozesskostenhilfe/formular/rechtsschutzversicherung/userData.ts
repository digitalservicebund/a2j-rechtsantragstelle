import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const rsvCoverageSchema = z.enum(
  ["yes", "no", "partly", "unknown"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeRsvInputSchema = {
  hasRsv: YesNoAnswer,
  hasRsvCoverage: rsvCoverageSchema,
  hasRsvThroughOrg: YesNoAnswer,
  hasOrgCoverage: rsvCoverageSchema,
};

const _partialSchema = z.object(prozesskostenhilfeRsvInputSchema).partial();
export type ProzesskostenhilfeRechtsschutzversicherungUserData = z.infer<
  typeof _partialSchema
>;
