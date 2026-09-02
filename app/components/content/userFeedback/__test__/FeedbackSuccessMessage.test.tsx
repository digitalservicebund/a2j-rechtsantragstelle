import { render } from "@testing-library/react";
import { FeedbackSuccessMessage } from "../FeedbackSuccessMessage";
import { componentsTranslations } from "~/services/translations/components";

const successfulMessage = componentsTranslations.feedback["success-message"].de;

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
