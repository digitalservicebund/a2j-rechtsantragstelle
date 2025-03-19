import { render } from "@testing-library/react";
import { PostSubmissionBox } from "../PostSubmissionBox";

const HEADING_POST_SUBMISSION = "Vielen Dank!";
const FEEDBACK_HELPS = "Feedback helps us";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    ["success-message"]: HEADING_POST_SUBMISSION,
    ["feedback-helps"]: FEEDBACK_HELPS,
  }),
}));

describe("PostSubmissionBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = render(<PostSubmissionBox shouldFocus={false} />);

    expect(getByText(HEADING_POST_SUBMISSION)).toBeInTheDocument();
    expect(getByText(FEEDBACK_HELPS)).toBeInTheDocument();
  });

  it("should render the component with the focus on the heading ", () => {
    const { getByText } = render(<PostSubmissionBox shouldFocus />);

    expect(getByText(HEADING_POST_SUBMISSION)).toHaveFocus();
  });
});
