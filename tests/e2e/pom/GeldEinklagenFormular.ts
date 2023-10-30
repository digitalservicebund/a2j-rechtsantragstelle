import { Formular } from "tests/e2e/pom/Formular";

export class GeldEinklagenFormular extends Formular {
  readonly url = "/geld-einklagen/formular";
  readonly initialStep = "start";
}
