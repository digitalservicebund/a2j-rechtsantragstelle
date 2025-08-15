import { render } from "@testing-library/react";
import { FeedbackSuccessMessage } from "~/components/userFeedback/FeedbackSuccessMessage";
import { translations } from "~/services/translations/translations";

const successfulMessage = translations.feedback["success-message"].de;

describe("FeedbackSuccessMessage", () => {
  it("should render with the title from translation and subtitle as props", () => {
    const subtitleText = "Another subtitle";
    const { getByText } = render(
      <FeedbackSuccessMessage subtitle={subtitleText} />,
    );
    const title = getByText(successfulMessage);
    expect(title).toBeInTheDocument();
    expect(getByText(subtitleText)).toBeInTheDocument();
  });

  it("should render an icon", () => {
    const { getByTestId } = render(<FeedbackSuccessMessage subtitle={""} />);
    const icon = getByTestId("CheckCircleIcon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-green-600");
  });
});
