import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { BeratungshilfeVorabcheckContext } from "~/domains/beratungshilfe/vorabcheck/context";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenVorabcheckContext } from "~/domains/geldEinklagen/vorabcheck/context";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfe/formular";
import { kontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext
    | ProzesskostenhilfeFormularContext
    | kontopfaendungWegweiserContext,
> = Readonly<Array<Readonly<[T, readonly string[]]>>>;
