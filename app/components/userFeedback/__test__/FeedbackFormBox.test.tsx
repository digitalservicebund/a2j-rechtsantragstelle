import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { useMemo } from "react";
import { TranslationContext } from "~/services/translations/translationsContext";
import { FEEDBACK_FIELD_NAME, FeedbackFormBox } from "../FeedbackFormBox";
import type { FeedbackTranslationKeys } from "../feedbackTranslations";

const HEADING_FEEDBACK = "Heading";
const ABORT_BUTTON_FEEDBACK = "Abort button";
const SUBMIT_BUTTON_FEEDBACK = "Submit button";

describe("FeedbackFormBox", () => {
  const FeedbackContextComponent = (props: { children: React.ReactNode }) => {
    const feedbackTranslationMemo = useMemo(
      () => ({
        feedback: {
          "heading-feedback": HEADING_FEEDBACK,
          "abort-button-feedback": ABORT_BUTTON_FEEDBACK,
          "submit-button-feedback": SUBMIT_BUTTON_FEEDBACK,
          "placeholder-feedback": "placeholder",
        } satisfies Record<FeedbackTranslationKeys, string>,
        video: {},
        accessibility: {},
      }),
      [],
    );
    return (
      <TranslationContext.Provider value={feedbackTranslationMemo}>
        {props.children}
      </TranslationContext.Provider>
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
