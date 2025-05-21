import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import type { BeratungshilfeVorabcheckUserData } from "~/domains/beratungshilfe/vorabcheck/userData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenVorabcheckContext } from "~/domains/geldEinklagen/vorabcheck/context";
import { type KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfe/formular/context";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckUserData
    | BeratungshilfeFormularUserData
    | GeldEinklagenVorabcheckContext
    | FluggastrechtVorabcheckContext
    | FluggastrechteUserData
    | ProzesskostenhilfeFormularContext
    | KontopfaendungWegweiserContext,
> = Readonly<Array<Readonly<[T, readonly string[]]>>>;
