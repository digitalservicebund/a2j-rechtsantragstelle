import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const coverage = z.enum(["yes", "no", "partly", "unknown"]);

export const prozesskostenhilfeRsvContext = {
  hasRsv: YesNoAnswer,
  hasRsvCoverage: coverage,
  hasOrg: YesNoAnswer,
  hasOrgCoverage: coverage,
};

const _contextObject = z.object(prozesskostenhilfeRsvContext).partial();
export type ProzesskostenhilfeRechtsschutzversicherungContext = z.infer<
  typeof _contextObject
>;
