import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { FeedbackType } from "~/components/userFeedback";
import { FEEDBACK_FIELD_NAME, FeedbackFormBox } from "../FeedbackFormBox";

const SUBMIT_BUTTON_FEEDBACK = "Submit button";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "submit-button-feedback": SUBMIT_BUTTON_FEEDBACK,
  }),
}));

describe("FeedbackFormBox", () => {
  it("should render the component with the given translations", () => {
    const FeedbackFormBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackFormBox
            destination="destination"
            shouldFocus={false}
            feedback={FeedbackType.Positive}
            onSubmit={vitest.fn}
          />
        ),
      },
    ]);
    const { getByText } = render(<FeedbackFormBoxWithRemixStub />);

    expect(getByText(SUBMIT_BUTTON_FEEDBACK)).toBeInTheDocument();
  });

  it("should render the component with the focus on the text area ", () => {
    const FeedbackFormBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackFormBox
            destination="destination"
            shouldFocus
            feedback={FeedbackType.Positive}
            onSubmit={vitest.fn}
          />
        ),
      },
    ]);
    const { container } = render(<FeedbackFormBoxWithRemixStub />);

    expect(container.querySelector(`#${FEEDBACK_FIELD_NAME}`)).toHaveFocus();
  });
});
