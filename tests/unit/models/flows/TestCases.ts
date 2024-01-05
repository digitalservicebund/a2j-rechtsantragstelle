import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/context";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/context";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
