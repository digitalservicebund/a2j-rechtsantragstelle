import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import type { BeratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import type { BeratungshilfeRechtsproblem } from "./rechtsproblem/context";
import type { BeratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import type { BeratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...beratungshilfePersoenlicheDaten,
} as const;

export type BeratungshilfeAntragContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten;
