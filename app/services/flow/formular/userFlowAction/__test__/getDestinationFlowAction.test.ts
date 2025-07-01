import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { getDestinationFlowAction } from "../getDestinationFlowAction";

const mockPathname =
  "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht";

describe("getDestinationFlowAction", () => {
  it("should return the next step in case it does not have an array", () => {
    const mockFlowController = {
      getNext: () => "/beratungshilfe/antrag/finanzielle-angaben/next-step",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as ReturnType<typeof buildFlowController>;

    const actual = getDestinationFlowAction(mockFlowController, mockPathname);

    expect(actual).toBe("/beratungshilfe/antrag/finanzielle-angaben/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", () => {
    const mockFlowController = {
      getNext: () => undefined,
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as ReturnType<typeof buildFlowController>;

    const actual = getDestinationFlowAction(mockFlowController, mockPathname);

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", () => {
    const mockFlowController = {
      getNext: () =>
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      getInitial: () => "/beratungshilfe/antrag/initial-step",
    } as unknown as ReturnType<typeof buildFlowController>;

    const actual = getDestinationFlowAction(
      mockFlowController,
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/address",
    );
  });
});
