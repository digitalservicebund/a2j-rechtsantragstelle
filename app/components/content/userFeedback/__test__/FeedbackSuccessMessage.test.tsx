import { render } from "@testing-library/react";
import { translations } from "~/services/translations/translations";
import { FeedbackSuccessMessage } from "../FeedbackSuccessMessage";

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
});
