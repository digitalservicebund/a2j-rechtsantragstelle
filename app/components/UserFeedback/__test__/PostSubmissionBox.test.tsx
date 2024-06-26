import { render } from "@testing-library/react";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";
import { PostSubmissionBox } from "../PostSubmissionBox";

const HEADING_POST_SUBMISSION = "Heading";
const TEXT_POST_SUBMISSION = "Text";

const TRANSLATION_KEY_RECORD = {
  "heading-post-submission": HEADING_POST_SUBMISSION,
  "text-post-submission": TEXT_POST_SUBMISSION,
};

describe("PostSubmissionBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = render(
      <FeedbackTranslationContext.Provider
        value={{ translations: TRANSLATION_KEY_RECORD }}
      >
        <PostSubmissionBox />
      </FeedbackTranslationContext.Provider>,
    );

    expect(getByText(HEADING_POST_SUBMISSION)).toBeInTheDocument();
    expect(getByText(TEXT_POST_SUBMISSION)).toBeInTheDocument();
  });
});
