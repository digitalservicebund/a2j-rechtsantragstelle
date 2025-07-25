import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { BeratungshilfeVorabcheckUserData } from "~/domains/beratungshilfe/vorabcheck/userData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { type KontopfaendungWegweiserUserData } from "../kontopfaendung/wegweiser/userData";
import type { ProzesskostenhilfeFormularUserData } from "../prozesskostenhilfe/formular/userData";

export type TestCases<
  T extends
    | BeratungshilfeVorabcheckUserData
    | BeratungshilfeFormularUserData
    | GeldEinklagenVorabcheckUserData
    | FluggastrechtVorabcheckUserData
    | FluggastrechteUserData
    | ProzesskostenhilfeFormularUserData
    | KontopfaendungWegweiserUserData,
> = Readonly<Array<Readonly<[T, readonly string[]]>>>;
