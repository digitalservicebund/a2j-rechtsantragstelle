import { Vorabcheck } from "./Vorabcheck";

export class GeldEinklagenVorabcheck extends Vorabcheck {
  readonly url = "/geld-einklagen/vorabcheck";
  readonly initialStep = "start";
}
