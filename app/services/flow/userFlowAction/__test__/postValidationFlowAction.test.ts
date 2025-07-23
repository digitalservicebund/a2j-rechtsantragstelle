import { getPageAndFlowDataFromPathname } from "../../getPageAndFlowDataFromPathname";
import { postValidationFlowAction } from "../postValidationFlowAction";

vi.mock("../../getPageAndFlowDataFromPathname");
vi.mock("~/services/flow/getPrunedUserDataFromPathname", () => ({
  getPrunedUserDataFromPathname: vi.fn(() => ({
    userDataWithPageData: {},
  })),
}));

const mockUserData = { name: "John Doe" };
const mockRequest = new Request(
  "https://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);

describe("postValidationFormUserData", () => {
  it("should call matching post actions", async () => {
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    vi.mocked(getPageAndFlowDataFromPathname).mockReturnValue({
      currentFlow: {
        asyncFlowActions: { "/test": mockAction1, "/test1": mockAction2 },
      },
      stepId: "/test",
    } as unknown as ReturnType<typeof getPageAndFlowDataFromPathname>);

    await postValidationFlowAction(mockRequest, mockUserData);

    expect(mockAction1).toHaveBeenCalledWith(mockRequest, mockUserData);
    expect(mockAction2).not.toHaveBeenCalled();
  });

  it("should handle missing asyncFlowActions", () => {
    vi.mocked(getPageAndFlowDataFromPathname).mockReturnValue({
      currentFlow: {},
      stepId: "/test",
    } as unknown as ReturnType<typeof getPageAndFlowDataFromPathname>);

    expect(
      async () => await postValidationFlowAction(mockRequest, mockUserData),
    ).not.toThrow();
  });
});
