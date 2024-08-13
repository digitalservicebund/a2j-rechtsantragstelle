import { Vorabcheck } from "./Vorabcheck";

export class FluggastrechteVorabcheck extends Vorabcheck {
  readonly url = "/fluggastrechte/vorabcheck";
  readonly initialStep = "start";
}
