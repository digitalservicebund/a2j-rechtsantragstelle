import type { GenericGuard } from "~/domains/guards.server";
import { type ProzesskostenhilfeRechtsschutzversicherungUserData } from "./userData";

export const rechtsschutzversicherungDone: GenericGuard<
  ProzesskostenhilfeRechtsschutzversicherungUserData
> = ({ context }) =>
  Boolean(
    (context.hasRsv === "no" ||
      context.hasRsvCoverage === "no" ||
      context.hasRsvCoverage === "partly") &&
      (context.hasRsvThroughOrg === "no" ||
        context.hasOrgCoverage === "no" ||
        context.hasOrgCoverage === "partly"),
  );
