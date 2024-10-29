import type { BeratungshilfeFormularContext } from "app/flows/beratungshilfe/formular";
import type { BeratungshilfeVorabcheckContext } from "~/flows/beratungshilfe/vorabcheck/context";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/formular/context";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagen/vorabcheck/context";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfe/formular";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext
    | ProzesskostenhilfeFormularContext,
> = Readonly<Array<Readonly<[T, Readonly<Array<string>>]>>>;
