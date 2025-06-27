import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { postValidationFormUserData } from "../postValidationFormUserData";

const mockUserData = { name: "John Doe" };
const mockRequest = new Request(
  "https://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);

vi.mock("~/services/analytics/customEvent");
vi.mock("~/services/flow/server/executeAsyncFlowActionByStepId");

beforeEach(() => {
  vi.clearAllMocks();
});

const mockFlowControllerWithoutCustomAnalyticsEventName = {
  getMeta: () => ({
    customAnalyticsEventName: undefined,
  }),
} as unknown as ReturnType<typeof buildFlowController>;

describe("postValidationFormUserData", () => {
  it("should call sendCustomAnalyticsEvent in case a customAnalyticsEventName is set", async () => {
    const mockFlowController = {
      getMeta: () => ({
        customAnalyticsEventName: "testEvent",
      }),
    } as unknown as ReturnType<typeof buildFlowController>;

    await postValidationFormUserData(
      mockRequest,
      mockFlowController,
      mockUserData,
    );

    expect(sendCustomAnalyticsEvent).toHaveBeenCalledWith({
      request: mockRequest,
      eventName: "testEvent",
      properties: mockUserData,
    });
  });

  it("should not call sendCustomAnalyticsEvent in case a customAnalyticsEventName is not set", async () => {
    await postValidationFormUserData(
      mockRequest,
      mockFlowControllerWithoutCustomAnalyticsEventName,
      mockUserData,
    );

    expect(sendCustomAnalyticsEvent).not.toHaveBeenCalled();
  });

  it("should call executeAsyncFlowActionByStepId", async () => {
    await postValidationFormUserData(
      mockRequest,
      mockFlowControllerWithoutCustomAnalyticsEventName,
      mockUserData,
    );

    expect(executeAsyncFlowActionByStepId).toBeCalledTimes(1);
  });
});
