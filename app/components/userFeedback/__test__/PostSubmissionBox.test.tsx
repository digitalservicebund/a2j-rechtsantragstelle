import { render } from "@testing-library/react";
import { TranslationContext } from "~/services/translations/translationsContext";
import type { PostSubmissionTranslationKeys } from "../feedbackTranslations";
import { PostSubmissionBox } from "../PostSubmissionBox";

const HEADING_POST_SUBMISSION = "Heading";
const TEXT_POST_SUBMISSION = "Text";

const contextObj = {
  feedback: {
    ["heading-post-submission"]: HEADING_POST_SUBMISSION,
    ["text-post-submission"]: TEXT_POST_SUBMISSION,
  } satisfies Record<PostSubmissionTranslationKeys, string>,
  video: {},
};

describe("PostSubmissionBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = render(
      <TranslationContext.Provider value={contextObj}>
        <PostSubmissionBox shouldFocus={false} />
      </TranslationContext.Provider>,
    );

    expect(getByText(HEADING_POST_SUBMISSION)).toBeInTheDocument();
    expect(getByText(TEXT_POST_SUBMISSION)).toBeInTheDocument();
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
