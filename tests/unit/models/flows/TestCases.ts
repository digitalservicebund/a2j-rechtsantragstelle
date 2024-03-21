import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/context";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/context";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
