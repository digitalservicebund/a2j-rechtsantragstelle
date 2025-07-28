import {
  buildFlowController,
  type FlowController,
} from "~/services/flow/server/buildFlowController";
import { flowDestination } from "../flowDestination";

const mockPathname =
  "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht";
vi.mock("~/services/flow/server/buildFlowController");

describe("getDestinationFlowAction", () => {
  it("should return the next step in case it does not have an array", () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () => "/beratungshilfe/antrag/finanzielle-angaben/next-step",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = flowDestination(mockPathname, {});

    expect(actual).toBe("/beratungshilfe/antrag/finanzielle-angaben/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () => undefined,
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = flowDestination(mockPathname, {});

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", () => {
    vi.mocked(buildFlowController).mockReturnValueOnce({
      getNext: () =>
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as FlowController);

    const actual = flowDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      {},
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/address",
    );
  });
});
