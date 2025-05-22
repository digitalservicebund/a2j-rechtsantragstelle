import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { BeratungshilfeVorabcheckContext } from "~/domains/beratungshilfe/vorabcheck/context";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { type KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfe/formular/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckContext
    | BeratungshilfeFormularContext
    | GeldEinklagenVorabcheckUserData
    | FluggastrechtVorabcheckContext
    | FluggastrechtContext
    | ProzesskostenhilfeFormularContext
    | KontopfaendungWegweiserContext,
> = Readonly<Array<Readonly<[T, readonly string[]]>>>;
