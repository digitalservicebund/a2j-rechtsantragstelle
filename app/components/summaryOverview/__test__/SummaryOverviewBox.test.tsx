import { render } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { useFlowFormular } from "../../form/flowFormularContext";
import SummaryOverviewBox from "../SummaryOverviewBox";

vi.mock("../../form/flowFormularContext", () => ({
  useFlowFormular: vi.fn(),
}));

vi.mock("../SummaryOverviewBoxItem", () => ({
  default: vi.fn(() => <div data-testid="summary-overview-box-item" />),
}));

vi.mock("../../Heading", () => ({
  default: vi.fn(({ text }) => <h1 data-testid="heading">{text}</h1>),
}));

vi.mock("../../Button", () => ({
  default: vi.fn(({ href }) => (
    <a data-testid="edit-button" href={href}>
      Bearbeiten
    </a>
  )),
}));

describe("SummaryOverviewBox", () => {
  const mockUserData = { field1: "value1", field2: "value2" };
  const mockTranslations = { field1: "Field 1", field2: "Field 2" };
  const stepId = "/step-1";
  const boxId = 1;
  const boxItems = [{ field: "field1" }, { field: "field2" }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the heading when title is provided", () => {
    vi.mocked(useFlowFormular).mockReturnValue({
      translations: mockTranslations,
      userData: mockUserData,
      validFlowPages: {},
      flowId: "/beratungshilfe/antrag",
    });

    const { getByTestId } = render(
      <SummaryOverviewBox
        boxId={boxId}
        stepId={stepId}
        userData={mockUserData}
        boxItems={boxItems}
        title="Test Title"
      />,
    );

    expect(getByTestId("heading")).toHaveTextContent("Test Title");
  });

  it("should render SummaryOverviewBoxItem for each field", () => {
    vi.mocked(useFlowFormular).mockReturnValue({
      translations: mockTranslations,
      userData: mockUserData,
      validFlowPages: {},
      flowId: "/beratungshilfe/antrag",
    });

    const { getAllByTestId } = render(
      <SummaryOverviewBox
        boxId={boxId}
        stepId={stepId}
        userData={mockUserData}
        boxItems={boxItems}
        title="Test Title"
      />,
    );

    const items = getAllByTestId("summary-overview-box-item");
    expect(items.length).toBe(2); // Ensuring 2 fields are rendered
  });

  it("should render the edit button with correct href", () => {
    vi.mocked(useFlowFormular).mockReturnValue({
      translations: mockTranslations,
      userData: mockUserData,
      validFlowPages: {},
      flowId: "/beratungshilfe/antrag",
    });

    const { getByTestId } = render(
      <SummaryOverviewBox
        boxId={boxId}
        stepId={stepId}
        userData={mockUserData}
        boxItems={boxItems}
        title="Test Title"
      />,
    );

    const editButton = getByTestId("edit-button");
    expect(editButton).toHaveAttribute("href", "/beratungshilfe/antrag/step-1");
    expect(editButton).toHaveTextContent("Bearbeiten");
  });
});
