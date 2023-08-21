import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/pages";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export type TestCases<
  T extends BeratungshilfeVorabcheckContext | GeldEinklagenVorabcheckContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
