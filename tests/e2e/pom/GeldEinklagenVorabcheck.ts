import { Vorabcheck } from "tests/e2e/pom/Vorabcheck";

export class GeldEinklagenVorabcheck extends Vorabcheck {
  readonly url = "/geld-einklagen/vorabcheck";
  readonly initialStep = "start";
}
