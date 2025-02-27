import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const rsvCoverage = z.enum(
  ["yes", "no", "partly", "unknown"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeRsvContext = {
  hasRsv: YesNoAnswer,
  hasRsvCoverage: rsvCoverage,
  hasRsvThroughOrg: YesNoAnswer,
  hasOrgCoverage: rsvCoverage,
};

const _contextObject = z.object(prozesskostenhilfeRsvContext).partial();
export type ProzesskostenhilfeRechtsschutzversicherungContext = z.infer<
  typeof _contextObject
>;
