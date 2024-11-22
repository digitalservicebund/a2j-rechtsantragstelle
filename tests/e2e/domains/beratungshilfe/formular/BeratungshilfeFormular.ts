import { Formular } from "tests/e2e/domains/shared/Formular";

export class BeratungshilfeFormular extends Formular {
  readonly url = "/beratungshilfe/antrag";
  readonly initialStep = "start/start";
}
