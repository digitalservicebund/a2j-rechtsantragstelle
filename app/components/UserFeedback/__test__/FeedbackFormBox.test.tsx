import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import {
  ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY,
  FeedbackFormBox,
  HEADING_FEEDBACK_TRANSLATION_KEY,
  SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY,
} from "../FeedbackFormBox";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";

const HEADING_FEEDBACK = "Heading";
const ABORT_BUTTON_FEEDBACK = "Abort button";
const SUBMIT_BUTTON_FEEDBACK = "Submit button";

const TRANSLATION_KEY_RECORD = {
  [HEADING_FEEDBACK_TRANSLATION_KEY]: HEADING_FEEDBACK,
  [ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY]: ABORT_BUTTON_FEEDBACK,
  [SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY]: SUBMIT_BUTTON_FEEDBACK,
};

describe("FeedbackFormBox", () => {
  it("should render the component with the given translations", () => {
    const FeedbackFormBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackTranslationContext.Provider
            value={{ translations: TRANSLATION_KEY_RECORD }}
          >
            <FeedbackFormBox
              destination="destination"
              shouldFocus={false}
              onSubmit={vitest.fn}
            />
          </FeedbackTranslationContext.Provider>
        ),
      },
    ]);
    const { getByText } = render(<FeedbackFormBoxWithRemixStub />);

    expect(getByText(HEADING_FEEDBACK)).toBeInTheDocument();
    expect(getByText(ABORT_BUTTON_FEEDBACK)).toBeInTheDocument();
    expect(getByText(SUBMIT_BUTTON_FEEDBACK)).toBeInTheDocument();
  });
});
