import { render } from "@testing-library/react";
import { HeadingProps } from "~/components/Heading";
import SummaryOverview from "../SummaryOverview";

const mockSummaryOverviewProps = {
  navigation: [
    {
      title: {
        tagName: "h2",
        text: "title",
        look: "",
      } as HeadingProps,
      id: 1,
      boxes: [
        {
          stepId: "stepId",
          boxItems: [
            {
              field: "fields",
            },
          ],
          id: 10,
        },
      ],
    },
  ],
};

vi.mock("~/components/Heading", () => ({
  default: () => <div>Mock Heading</div>,
}));

vi.mock("../SummaryOverviewBoxWrapped", () => ({
  default: () => <div>Mock SummaryOverviewBoxWrapped</div>,
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

    expect(getByText("Mock SummaryOverviewBoxWrapped")).toBeInTheDocument();
  });
});
