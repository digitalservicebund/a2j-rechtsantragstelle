import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/pages";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
