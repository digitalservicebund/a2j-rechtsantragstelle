import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/context";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
