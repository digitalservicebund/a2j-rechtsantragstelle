import { render } from "@testing-library/react";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";
import {
  HEADING_POST_SUBMISSION_TRANSLATION_KEY,
  PostSubmissionBox,
  TEXT_POST_SUBMISSION_TRANSLATION_KEY,
} from "../PostSubmissionBox";

const HEADING_POST_SUBMISSION = "Heading";
const TEXT_POST_SUBMISSION = "Text";

const TRANSLATION_KEY_RECORD = {
  [HEADING_POST_SUBMISSION_TRANSLATION_KEY]: HEADING_POST_SUBMISSION,
  [TEXT_POST_SUBMISSION_TRANSLATION_KEY]: TEXT_POST_SUBMISSION,
};

describe("PostSubmissionBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = render(
      <FeedbackTranslationContext.Provider
        value={{ translations: TRANSLATION_KEY_RECORD }}
      >
        <PostSubmissionBox shouldFocus={false} />
      </FeedbackTranslationContext.Provider>,
    );

    expect(getByText(HEADING_POST_SUBMISSION)).toBeInTheDocument();
    expect(getByText(TEXT_POST_SUBMISSION)).toBeInTheDocument();
  });
});
