import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { useMemo } from "react";
import { FeedbackType } from "~/components/userFeedback";
import { TranslationContext } from "~/services/translations/translationsContext";
import { FEEDBACK_FIELD_NAME, FeedbackFormBox } from "../FeedbackFormBox";
import type { FeedbackTranslationKeys } from "../feedbackTranslations";

const SUBMIT_BUTTON_FEEDBACK = "Submit button";

describe("FeedbackFormBox", () => {
  const FeedbackContextComponent = (props: { children: React.ReactNode }) => {
    const feedbackTranslationMemo = useMemo(
      () => ({
        feedback: {
          "heading-feedback": "placeholder",
          "submit-button-feedback": SUBMIT_BUTTON_FEEDBACK,
          "placeholder-feedback": "placeholder",
          "heading-personal-data-feedback": "placeholder",
          "positive-feedback-question": "placeholder",
          "negative-feedback-question": "placeholder",
          "success-message": "placeholder",
          "antwort-uebermittelt": "placeholder",
          "feedback-helps": "placeholder",
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
              feedback={FeedbackType.Positive}
              onSubmit={vitest.fn}
            />
          </FeedbackContextComponent>
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
          <FeedbackContextComponent>
            <FeedbackFormBox
              destination="destination"
              shouldFocus
              feedback={FeedbackType.Positive}
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
