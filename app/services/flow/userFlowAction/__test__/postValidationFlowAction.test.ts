import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { postValidationFlowAction } from "../postValidationFlowAction";

const mockUserData = { name: "John Doe" };
const mockRequest = new Request(
  "https://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);

vi.mock("~/services/analytics/customEvent");
vi.mock("~/services/flow/server/executeAsyncFlowActionByStepId");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("postValidationFormUserData", () => {
  it("should call executeAsyncFlowActionByStepId", async () => {
    await postValidationFlowAction(mockRequest, mockUserData);

    expect(executeAsyncFlowActionByStepId).toHaveBeenCalledWith(
      expect.anything(),
      "/finanzielle-angaben/kinder/uebersicht",
      mockRequest,
      mockUserData,
    );
  });
});
