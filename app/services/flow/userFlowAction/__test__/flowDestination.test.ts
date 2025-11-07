import {
  buildFlowController,
  type FlowController,
} from "~/services/flow/server/buildFlowController";
import { flowDestination } from "../flowDestination";
import { pruneIrrelevantData } from "../../pruner/pruner";

const mockPathname =
  "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht";
vi.mock("~/services/flow/server/buildFlowController");
vi.mock("../../pruner/pruner");

const mockPrunerData = (userDataMock?: Record<string, string>) => {
  vi.mocked(pruneIrrelevantData).mockResolvedValue({
    prunedData: userDataMock ?? {},
    validFlowPaths: {},
  });
};

beforeEach(() => {
  vi.resetAllMocks();
  mockPrunerData();
});

describe("getDestinationFlowAction", () => {
  it("should return the next step in case it does not have an array", async () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () => "/beratungshilfe/antrag/finanzielle-angaben/next-step",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = await flowDestination(mockPathname, {});

    expect(actual).toBe("/beratungshilfe/antrag/finanzielle-angaben/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", async () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () => undefined,
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = await flowDestination(mockPathname, {});

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", async () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () =>
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = await flowDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      {},
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/address",
    );
  });

  it("should return call pruneIrrelevantData and use the pruned data in the flow controller", async () => {
    const userDataMock = { someData: "someValue" };
    mockPrunerData(userDataMock);
    const buildFlowControllerMock = vi
      .mocked(buildFlowController)
      .mockReturnValueOnce({
        getNext: () => "/beratungshilfe/antrag/finanzielle-angaben/next-step",
        getInitial: () => "/beratungshilfe/antrag/initial-step",
      } as unknown as FlowController);

    await flowDestination(mockPathname, {});

    expect(pruneIrrelevantData).toHaveBeenCalledWith({}, expect.any(String));
    expect(buildFlowControllerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { pageData: { arrayIndexes: [] }, ...userDataMock },
        config: expect.anything(),
        guards: expect.anything(),
      }),
    );
  });
});
