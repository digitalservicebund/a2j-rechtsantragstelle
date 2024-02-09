import { z } from "zod";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...beratungshilfePersoenlicheDaten,
} as const;

const contextObject = z.object(beratungshilfeFormularContext).partial();
export type BeratungshilfeFormularContext = z.infer<typeof contextObject>;
