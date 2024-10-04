import type { GenericGuard } from "~/flows/guards.server";
import { type ProzesskostenhilfeRechtschutzversicherungContext } from "./context";
import { hasPartlyorNoCoverage, hasNoRsvOrOrg } from "./guards";

export const rechtsschutzversicherungDone: GenericGuard<
  ProzesskostenhilfeRechtschutzversicherungContext
> = ({ context }) =>
  Boolean(hasNoRsvOrOrg(context) || hasPartlyorNoCoverage(context));
