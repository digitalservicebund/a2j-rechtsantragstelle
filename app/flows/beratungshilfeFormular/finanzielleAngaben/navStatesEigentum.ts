import { eigentumDone as eigentumDoneGuard } from "~/flows/beratungshilfeFormular/finanzielleAngaben/guards";
import type { BeratungshilfeFinanzielleAngabenGuard } from "./navStates";

export const eigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => eigentumDoneGuard({ context });
