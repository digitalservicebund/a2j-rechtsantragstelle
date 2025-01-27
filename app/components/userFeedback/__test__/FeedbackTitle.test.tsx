import { render } from "@testing-library/react";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackTitle";

describe("FeedbackTitle", () => {
  it("should render with the correct styling", () => {
    const titleText = "Testing a really cool title.";
    const subtitleText = "Another subtitle";
    const { getByText, getByTestId } = render(
      <FeedbackTitle title={titleText} subtitle={subtitleText} />,
    );
    const title = getByText(titleText);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("font-bold mr-4");
    expect(getByText(subtitleText)).toBeInTheDocument();
    const icon = getByTestId("CheckCircleIcon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-green-600");
  });
});
