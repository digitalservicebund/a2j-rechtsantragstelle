import { render } from "@testing-library/react";
import SummaryOverview from "../SummaryOverview";

const mockSummaryOverviewProps = {
  navigation: [
    {
      title: "title",
      id: 1,
      boxes: [
        {
          stepId: "stepId",
          id: 10,
        },
      ],
    },
  ],
};

vi.mock("~/components/Heading", () => ({
  default: () => <div>Mock Heading</div>,
}));

vi.mock("../SummaryOverviewBox", () => ({
  default: () => <div>Mock SummaryOverviewBox</div>,
}));

describe("SummaryOverview", () => {
  it("should render an heading component", () => {
    const { getByText } = render(
      <SummaryOverview {...mockSummaryOverviewProps} />,
    );

    expect(getByText("Mock Heading")).toBeInTheDocument();
  });

  it("should render an summary overview box component", () => {
    const { getByText } = render(
      <SummaryOverview {...mockSummaryOverviewProps} />,
    );

    expect(getByText("Mock SummaryOverviewBox")).toBeInTheDocument();
  });
});
