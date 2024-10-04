import type { GenericGuard } from "~/flows/guards.server";
import { type ProzesskostenhilfeRechtsschutzversicherungContext } from "./context";

export const rechtsschutzversicherungDone: GenericGuard<
  ProzesskostenhilfeRechtsschutzversicherungContext
> = ({ context }) =>
  Boolean(
    (context.hasRsv === "no" ||
      context.hasRsvCoverage === "no" ||
      context.hasRsvCoverage === "partly") &&
      (context.hasRsvThroughOrg === "no" ||
        context.hasOrgCoverage === "no" ||
        context.hasOrgCoverage === "partly"),
  );
