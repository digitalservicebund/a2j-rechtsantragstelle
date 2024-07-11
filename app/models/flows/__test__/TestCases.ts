import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfeVorabcheck/context";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechteVorabcheck/context";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagenVorabcheck/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
