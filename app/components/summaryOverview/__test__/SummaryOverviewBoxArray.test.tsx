import { render } from "@testing-library/react";
import { useFormFlow } from "../../form/formFlowContext";
import { addArrayIndexToPathUrl } from "../addArrayIndexToPathUrl";
import { getArraySummaryObject } from "../getArraySummaryObject";
import SummaryOverviewBoxArray from "../SummaryOverviewBoxArray";

vi.mock("../../form/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));

vi.mock("../getArraySummaryObject", () => ({
  getArraySummaryObject: vi.fn(),
}));

vi.mock("../addArrayIndexToPathUrl", () => ({
  addArrayIndexToPathUrl: vi.fn(),
}));

vi.mock("../SummaryOverviewBox", () => ({
  default: vi.fn(() => <div data-testid="summary-overview-box" />),
}));

describe("SummaryOverviewBoxArray", () => {
  const mockUserData = { someKey: "someValue" };
  const mockBoxItems = [
    { field: "field1", label: "Label 1" },
    { field: "field2", label: "Label 2" },
  ];
  const mockStepId = "test-step";
  const mockBoxId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFormFlow).mockReturnValue({
      userData: mockUserData,
      validFlowPages: {},
      translations: {},
      flowId: "/fluggastrechte/formular",
    });
    vi.mocked(addArrayIndexToPathUrl).mockImplementation(
      (stepId, index) => `${stepId}-${index}`,
    );
  });

  it("should render SummaryOverviewBox for each item in the array", () => {
    const mockArraySummary = [{ key: "value1" }, { key: "value2" }];
    vi.mocked(getArraySummaryObject).mockReturnValue(mockArraySummary);

    const { getAllByTestId } = render(
      <SummaryOverviewBoxArray
        boxId={mockBoxId}
        stepId={mockStepId}
        boxItems={mockBoxItems}
      />,
    );

    expect(getAllByTestId("summary-overview-box")).toHaveLength(
      mockArraySummary.length,
    );
  });

  it("should render null when getArraySummaryObject does not return an array", () => {
    vi.mocked(getArraySummaryObject).mockReturnValue(undefined);

    const { container } = render(
      <SummaryOverviewBoxArray
        boxId={mockBoxId}
        stepId={mockStepId}
        boxItems={mockBoxItems}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should correctly calls addArrayIndexToPathUrl with stepId and index", () => {
    const mockArraySummary = [{ key: "value1" }, { key: "value2" }];
    vi.mocked(getArraySummaryObject).mockReturnValue(mockArraySummary);

    render(
      <SummaryOverviewBoxArray
        boxId={mockBoxId}
        stepId={mockStepId}
        boxItems={mockBoxItems}
      />,
    );

    expect(addArrayIndexToPathUrl).toHaveBeenCalledTimes(
      mockArraySummary.length,
    );
    expect(addArrayIndexToPathUrl).toHaveBeenCalledWith(mockStepId, 0);
    expect(addArrayIndexToPathUrl).toHaveBeenCalledWith(mockStepId, 1);
  });
});
