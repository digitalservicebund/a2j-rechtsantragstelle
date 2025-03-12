import { render } from "@testing-library/react";
import { TranslationContext } from "~/services/translations/translationsContext";
import type { PostSubmissionTranslationKeys } from "../feedbackTranslations";
import { PostSubmissionBox } from "../PostSubmissionBox";

const HEADING_POST_SUBMISSION = "Vielen Dank!";
const TEXT_POST_SUBMISSION = "Text";
const FEEDBACK_HELPS = "Feedback helps us";

const contextObj = {
  feedback: {
    ["success-message"]: HEADING_POST_SUBMISSION,
    ["feedback-helps"]: FEEDBACK_HELPS,
    ["text-post-submission"]: TEXT_POST_SUBMISSION,
  } satisfies Record<PostSubmissionTranslationKeys, string>,
};

describe("PostSubmissionBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = render(
      <TranslationContext.Provider value={contextObj}>
        <PostSubmissionBox shouldFocus={false} />
      </TranslationContext.Provider>,
    );

    expect(getByText(HEADING_POST_SUBMISSION)).toBeInTheDocument();
    expect(getByText(FEEDBACK_HELPS)).toBeInTheDocument();
  });

  it("should render the component with the focus on the heading ", () => {
    const { getByText } = render(
      <TranslationContext.Provider value={contextObj}>
        <PostSubmissionBox shouldFocus />
      </TranslationContext.Provider>,
    );

    expect(getByText(HEADING_POST_SUBMISSION)).toHaveFocus();
  });
});
