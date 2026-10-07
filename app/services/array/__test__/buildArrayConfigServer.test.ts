import { type FlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { buildArrayConfigServer } from "../buildArrayConfigServer";

describe("buildArrayConfigServer", () => {
  it("should return undefined when flowSessionEngine.arrayInfo is undefined", () => {
    const flowSessionEngine = {
      arrayInfo: undefined,
      isReachable: vi.fn(),
    } as unknown as FlowSession<PageConfigMap>;

    const result = buildArrayConfigServer(
      flowSessionEngine,
      "/beratungshilfe/antrag",
    );

    expect(result).toBeUndefined();
  });

  it("should return the correct array configuration when flowSessionEngine.arrayInfo is defined", () => {
    const flowSessionEngine = {
      arrayInfo: {
        name: "arrayName",
        entryPoint: "daten",
        fieldName: "fieldName",
        indexOffset: 1,
        hiddenFields: ["field1", "field2"],
        shouldDisableAddButton: false,
      },
      nextArrayPath:
        "/finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten",
      isReachable: () => true,
      paths: ["/finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten"],
    } as unknown as FlowSession<PageConfigMap>;

    const result = buildArrayConfigServer(
      flowSessionEngine,
      "/beratungshilfe/antrag",
    );

    expect(result).toEqual({
      arrayName: {
        event: "add-arrayName",
        url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto",
        initialInputUrl: "daten",
        statementKey: "fieldName",
        shouldDisableAddButton: false,
        displayIndexOffset: 1,
        hiddenFields: ["field1", "field2"],
      },
    });
  });

  it("builds the url from nextArrayPath when the array is empty (item page not yet visited)", () => {
    const flowSessionEngine = {
      arrayInfo: {
        name: "arrayName",
        entryPoint: "daten",
        fieldName: "fieldName",
      },
      nextArrayPath:
        "/finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten",
      isReachable: () => true,
      // Empty array: the item page was never visited, so it is absent from paths.
      paths: [],
    } as unknown as FlowSession<PageConfigMap>;

    const result = buildArrayConfigServer(
      flowSessionEngine,
      "/beratungshilfe/antrag",
    );

    expect(result?.arrayName.url).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto",
    );
  });
});
