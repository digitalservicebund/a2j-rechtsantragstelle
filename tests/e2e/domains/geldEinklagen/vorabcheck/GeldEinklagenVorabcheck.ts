import { Vorabcheck } from "tests/e2e/domains/shared/Vorabcheck";

export class GeldEinklagenVorabcheck extends Vorabcheck {
  readonly url = "/geld-einklagen/vorabcheck";
  readonly initialStep = "start";
}
