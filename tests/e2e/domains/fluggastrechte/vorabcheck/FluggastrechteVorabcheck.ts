import { Vorabcheck } from "tests/e2e/domains/shared/Vorabcheck";

export class FluggastrechteVorabcheck extends Vorabcheck {
  readonly url = "/fluggastrechte/vorabcheck";
  readonly initialStep = "start";
}
