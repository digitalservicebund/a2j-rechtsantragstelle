import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { prozesskostenhilfeFormularFlowConfig } from "../flowConfig";

describe("prozesskostenhilfe formular statusTree", () => {
  const userData = {
    formularArt: "erstantrag",
    anhaengigesGerichtsverfahrenFrage: "yes",
    gerichtName: "",
    aktenzeichen: "",
    verfahrenArt: "verfahrenSelbststaendig",
    versandArt: "digital",
    empfaenger: "myself",
  };

  const { statusTree } = createFlowSession(
    prozesskostenhilfeFormularFlowConfig,
    userData,
    "/antragstellende-person/unterhaltsanspruch",
  );

  it("does not mark antragstellende-person as done while unterhaltsanspruch is unanswered", () => {
    expect(statusTree["/antragstellende-person"].isDone).toBe(false);
  });

  it("does not mark persoenliche-daten as done before any of its pages are answered", () => {
    expect(statusTree["/persoenliche-daten"].isDone).toBe(false);
  });

  it("does not mark any finanzielle-angaben subsection as done before its pages are answered", () => {
    const financialUserData = {
      ...userData,
      unterhaltsanspruch: "keine",
      hasRsv: "no",
      hasRsvThroughOrg: "no",
    };
    const { statusTree: financialStatusTree } = createFlowSession(
      prozesskostenhilfeFormularFlowConfig,
      financialUserData,
      "/finanzielle-angaben/einkuenfte/start",
    );
    const doneSubsections = Object.entries(
      financialStatusTree["/finanzielle-angaben"].children ?? {},
    )
      .filter(([, subsection]) => subsection.isDone)
      .map(([subsectionPath]) => subsectionPath);

    expect(doneSubsections).toEqual([]);
  });
});
