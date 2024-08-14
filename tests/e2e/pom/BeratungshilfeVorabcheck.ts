import { Vorabcheck } from "./Vorabcheck";

export class BeratungshilfeVorabcheck extends Vorabcheck {
  readonly url = "/beratungshilfe/vorabcheck";
  readonly initialStep = "rechtsschutzversicherung";
}
