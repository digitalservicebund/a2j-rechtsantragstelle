import { type BeratungshilfeAntragContext } from "..";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: (context: BeratungshilfeAntragContext) =>
    grundvoraussetzungDone(context) && rechtsproblemDone(context),
};
