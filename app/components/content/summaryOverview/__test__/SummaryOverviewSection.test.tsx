import { render } from "@testing-library/react";
import SummaryOverviewSection from "../SummaryOverviewSection";
import { type KernHeadingProps } from "~/components/kern/KernHeading";

const mockSummaryOverviewProps = {
  title: {
    tagName: "h2",
    text: "title",
  } satisfies KernHeadingProps,
  id: 1,
  boxes: [
    {
      stepId: "stepId",
      boxItems: [
        {
          inlineItems: [
            {
              field: "fields",
            },
          ],
        },
      ],
      id: 10,
    },
  ],
};

vi.mock("~/components/kern/KernHeading.tsx", () => ({
  default: () => <div>Mock Heading</div>,
}));

vi.mock("../SummaryOverviewBoxWrapped", () => ({
  default: () => <div>Mock SummaryOverviewBoxWrapped</div>,
}));

describe("SummaryOverviewSection", () => {
  it("should render an heading component", () => {
    const { getByText } = render(
      <SummaryOverviewSection {...mockSummaryOverviewProps} />,
    );

    expect(getByText("Mock Heading")).toBeInTheDocument();
  });

  it("should render an summary overview box component", () => {
    const { getByText } = render(
      <SummaryOverviewSection {...mockSummaryOverviewProps} />,
    );

    expect(getByText("Mock SummaryOverviewBoxWrapped")).toBeInTheDocument();
  });
});
