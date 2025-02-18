import { render } from "@testing-library/react";
import { useFormFlow } from "../../form/formFlowContext";
import SummaryOverviewBoxWrapped from "../SummaryOverviewBoxWrapped";

vi.mock("../../form/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));

vi.mock("../SummaryOverviewBox", () => ({
  default: vi.fn(() => <div data-testid="summary-overview-box" />),
}));

vi.mock("../SummaryOverviewBoxArray", () => ({
  default: vi.fn(() => <div data-testid="summary-overview-box-array" />),
}));

const boxItems = [{ field: "field1" }];

describe("SummaryOverviewBoxWrapped", () => {
  it("should render null when stepId is not in validFlowPages", () => {
    vi.mocked(useFormFlow).mockReturnValue({
      validFlowPages: {},
      userData: {},
      translations: {},
      flowId: "/fluggastrechte/formular",
    });

    const { container } = render(
      <SummaryOverviewBoxWrapped stepId="step1" id={1} boxItems={boxItems} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render SummaryOverviewBoxArray when isArrayPage is true", () => {
    vi.mocked(useFormFlow).mockReturnValue({
      validFlowPages: {
        step1: { isArrayPage: true },
      },
      userData: {},
      translations: {},
      flowId: "/fluggastrechte/formular",
    });

    const { getByTestId } = render(
      <SummaryOverviewBoxWrapped stepId="step1" id={1} boxItems={boxItems} />,
    );

    expect(getByTestId("summary-overview-box-array")).toBeInTheDocument();
  });

  it("should render SummaryOverviewBox when isArrayPage is false", () => {
    vi.mocked(useFormFlow).mockReturnValue({
      validFlowPages: {
        step1: { isArrayPage: false },
      },
      userData: {},
      translations: {},
      flowId: "/fluggastrechte/formular",
    });

    const { getByTestId } = render(
      <SummaryOverviewBoxWrapped stepId="step1" id={1} boxItems={boxItems} />,
    );

    expect(getByTestId("summary-overview-box")).toBeInTheDocument();
  });
});
