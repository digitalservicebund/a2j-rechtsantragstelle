import { Vorabcheck } from "tests/e2e/domains/shared/Vorabcheck";

export class BeratungshilfeVorabcheck extends Vorabcheck {
  readonly url = "/beratungshilfe/vorabcheck";
  readonly initialStep = "rechtsschutzversicherung";
}
