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
        displayIndexOffset: 1,
        hiddenFields: ["field1", "field2"],
      },
    });
  });
});
