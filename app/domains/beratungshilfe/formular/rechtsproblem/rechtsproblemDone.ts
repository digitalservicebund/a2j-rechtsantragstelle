import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { type GenericGuard } from "~/domains/guards.server";

export const rechtsproblemDone: GenericGuard<
  BeratungshilfeFormularUserData
> = ({ context }) =>
  Boolean(
    context.bereich &&
      context.gegenseite &&
      context.beschreibung &&
      context.ziel &&
      context.eigeninitiativeBeschreibung,
  );
