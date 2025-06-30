import type { GenericGuard } from "~/domains/guards.server";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const rechtsschutzversicherungDone: GenericGuard<
  ProzesskostenhilfeFormularUserData
> = ({ context }) =>
  Boolean(
    context.empfaenger === "otherPerson" ||
      ((context.hasRsv === "no" ||
        context.hasRsvCoverage === "no" ||
        context.hasRsvCoverage === "partly") &&
        (context.hasRsvThroughOrg === "no" ||
          context.hasOrgCoverage === "no" ||
          context.hasOrgCoverage === "partly")),
  );
