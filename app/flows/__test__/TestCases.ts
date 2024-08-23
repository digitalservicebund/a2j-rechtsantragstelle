import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { BeratungshilfeVorabcheckContext } from "~/flows/beratungshilfeVorabcheck/context";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagenVorabcheck/context";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfeFormular";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext
    | ProzesskostenhilfeFormularContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
