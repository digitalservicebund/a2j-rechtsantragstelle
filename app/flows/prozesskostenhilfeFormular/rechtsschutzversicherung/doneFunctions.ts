import type { GenericGuard } from "~/flows/guards.server";
import { type ProzesskostenhilfeRechtsschutzversicherungContext } from "./context";
import { hasPartlyorNoCoverage, hasNoRsvAndNoOrg } from "./guards";

export const rechtsschutzversicherungDone: GenericGuard<
  ProzesskostenhilfeRechtsschutzversicherungContext
> = ({ context }) =>
  Boolean(hasNoRsvAndNoOrg(context) || hasPartlyorNoCoverage(context));
