import { Formular } from "tests/e2e/domains/shared/Formular";

export class GeldEinklagenFormular extends Formular {
  readonly url = "/geld-einklagen/formular";
  readonly initialStep = "start";
}
