import { render } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { HeadingProps } from "~/components/Heading";
import { useFormFlow } from "../../form/formFlowContext";
import SummaryOverviewBox from "../SummaryOverviewBox";

vi.mock("../../form/formFlowContext", () => ({
  useFormFlow: vi.fn(),
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
  const titleMock = {
    tagName: "h2",
    text: "title",
    look: "",
  } as HeadingProps;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the heading when title is provided", () => {
    vi.mocked(useFormFlow).mockReturnValue({
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
        title={titleMock}
      />,
    );

    expect(getByTestId("heading")).toHaveTextContent(titleMock.text ?? "");
  });

  it("should render SummaryOverviewBoxItem for each field", () => {
    vi.mocked(useFormFlow).mockReturnValue({
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
        title={titleMock}
      />,
    );

    const items = getAllByTestId("summary-overview-box-item");
    expect(items.length).toBe(2); // Ensuring 2 fields are rendered
  });

  it("should render the edit button with correct href", () => {
    vi.mocked(useFormFlow).mockReturnValue({
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
        title={titleMock}
      />,
    );

    const editButton = getByTestId("edit-button");
    expect(editButton).toHaveAttribute("href", "/beratungshilfe/antrag/step-1");
    expect(editButton).toHaveTextContent("Bearbeiten");
  });
});
