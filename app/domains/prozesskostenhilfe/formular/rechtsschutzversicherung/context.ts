import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const coverage = z.enum(
  ["yes", "no", "partly", "unknown"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeRsvContext = {
  hasRsv: YesNoAnswer,
  hasRsvCoverage: coverage,
  hasRsvThroughOrg: YesNoAnswer,
  hasOrgCoverage: coverage,
};

const _contextObject = z.object(prozesskostenhilfeRsvContext).partial();
export type ProzesskostenhilfeRechtsschutzversicherungContext = z.infer<
  typeof _contextObject
>;
