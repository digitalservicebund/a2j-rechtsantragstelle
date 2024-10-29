import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export type Coverage = z.infer<typeof coverage>;

const coverage = z.enum(["yes", "no", "partly", "unknown"]);

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
