import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { useMemo } from "react";
import {
  ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY,
  FEEDBACK_FIELD_NAME,
  FeedbackFormBox,
  HEADING_FEEDBACK_TRANSLATION_KEY,
  SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY,
} from "../FeedbackFormBox";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";

const HEADING_FEEDBACK = "Heading";
const ABORT_BUTTON_FEEDBACK = "Abort button";
const SUBMIT_BUTTON_FEEDBACK = "Submit button";

describe("FeedbackFormBox", () => {
  const FeedbackContextComponent = (props: { children: React.ReactNode }) => {
    const feedbackTranslationMemo = useMemo(
      () => ({
        translations: {
          [HEADING_FEEDBACK_TRANSLATION_KEY]: HEADING_FEEDBACK,
          [ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY]: ABORT_BUTTON_FEEDBACK,
          [SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY]: SUBMIT_BUTTON_FEEDBACK,
        },
      }),
      [],
    );
    return (
      <FeedbackTranslationContext.Provider value={feedbackTranslationMemo}>
        {props.children}
      </FeedbackTranslationContext.Provider>
    );
  };
  it("should render the component with the given translations", () => {
    const FeedbackFormBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackContextComponent>
            <FeedbackFormBox
              destination="destination"
              shouldFocus={false}
              onSubmit={vitest.fn}
            />
          </FeedbackContextComponent>
        ),
      },
    ]);
    const { getByText } = render(<FeedbackFormBoxWithRemixStub />);

    expect(getByText(HEADING_FEEDBACK)).toBeInTheDocument();
    expect(getByText(ABORT_BUTTON_FEEDBACK)).toBeInTheDocument();
    expect(getByText(SUBMIT_BUTTON_FEEDBACK)).toBeInTheDocument();
  });

  it("should render the component with the focus on the text area ", () => {
    const FeedbackFormBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackContextComponent>
            <FeedbackFormBox
              destination="destination"
              shouldFocus
              onSubmit={vitest.fn}
            />
          </FeedbackContextComponent>
        ),
      },
    ]);
    const { container } = render(<FeedbackFormBoxWithRemixStub />);

    expect(container.querySelector(`#${FEEDBACK_FIELD_NAME}`)).toHaveFocus();
  });
});
