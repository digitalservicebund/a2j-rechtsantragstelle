import { Vorabcheck } from "tests/e2e/pom/Vorabcheck";

export class BeratungshilfeVorabcheck extends Vorabcheck {
  readonly url = "/beratungshilfe/vorabcheck";
  readonly initialStep = "rechtsschutzversicherung";
}
