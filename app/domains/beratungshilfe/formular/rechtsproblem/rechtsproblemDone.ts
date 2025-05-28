import type { GenericGuard } from "~/domains/guards.server";
import type { BeratungshilfeRechtsproblemUserData } from "./userData";

export const rechtsproblemDone: GenericGuard<
  BeratungshilfeRechtsproblemUserData
> = ({ context }) =>
  Boolean(
    context.bereich &&
      context.gegenseite &&
      context.beschreibung &&
      context.ziel &&
      context.eigeninitiativeBeschreibung,
  );
