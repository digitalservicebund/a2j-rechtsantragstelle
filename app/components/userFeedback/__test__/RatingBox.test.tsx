import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render } from "@testing-library/react";
import { useMemo } from "react";
import { TranslationContext } from "~/services/translations/translationsContext";
import type { RatingBoxTranslationKeys } from "../feedbackTranslations";
import { RatingBox } from "../RatingBox";

const YES_RATING = "yes";
const NO_RATING = "no";

describe("RatingBox", () => {
  const FeedbackContextComponent = (props: { children: React.ReactNode }) => {
    const feedbackTranslationMemo = useMemo(
      () => ({
        feedback: {
          ["yes-rating"]: YES_RATING,
          ["no-rating"]: NO_RATING,
        } satisfies Record<RatingBoxTranslationKeys, string>,
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
    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackContextComponent>
            <RatingBox heading="heading" url="url" onSubmit={vitest.fn} />
          </FeedbackContextComponent>
        ),
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);

    expect(getByText(YES_RATING)).toBeInTheDocument();
    expect(getByText(NO_RATING)).toBeInTheDocument();
  });

  it("should call onSubmit method when clicks on the Yes button", () => {
    const onSubmitMock = vitest.fn();

    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackContextComponent>
            <RatingBox heading="heading" url="url" onSubmit={onSubmitMock} />
          </FeedbackContextComponent>
        ),
      },
      {
        path: "/action/send-rating",
        action() {
          return {};
        },
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);
    fireEvent.click(getByText(YES_RATING));

    expect(onSubmitMock).toBeCalled();
  });

  it("should call obSubmit method when clicks on the No button", () => {
    const onSubmitMock = vitest.fn();

    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackContextComponent>
            <RatingBox heading="heading" url="url" onSubmit={onSubmitMock} />
          </FeedbackContextComponent>
        ),
      },
      {
        path: "/action/send-rating",
        action() {
          return {};
        },
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);

    fireEvent.click(getByText(NO_RATING));

    expect(onSubmitMock).toBeCalled();
  });
});
