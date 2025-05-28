import type { GenericGuard } from "~/domains/guards.server";
import type { BeratungshilfeGrundvoraussetzungenUserData } from "./userData";

export const grundvoraussetzungDone: GenericGuard<
  BeratungshilfeGrundvoraussetzungenUserData
> = ({ context }) =>
  Boolean(
    context.rechtsschutzversicherung === "no" &&
      context.wurdeVerklagt === "no" &&
      context.klageEingereicht === "no" &&
      context.beratungshilfeBeantragt === "no" &&
      context.eigeninitiativeGrundvorraussetzung === "no",
  );
