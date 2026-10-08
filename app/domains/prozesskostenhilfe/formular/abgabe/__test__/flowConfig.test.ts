import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { prozesskostenhilfeFormularFlowConfig } from "../../flowConfig";
import { pkhTestcaseData } from "../../__test__/testcasesData";

describe("prozesskostenhilfe formular abgabe", () => {
  it("has no next page on ueberpruefung, so it shows no Weiter button", () => {
    const { nextPath } = createFlowSession(
      prozesskostenhilfeFormularFlowConfig,
      { ...pkhTestcaseData },
      "/abgabe/ueberpruefung",
    );

    expect(nextPath).toBeUndefined();
  });
});
