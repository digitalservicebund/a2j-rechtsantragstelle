import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render } from "@testing-library/react";
import { useMemo } from "react";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";
import {
  NO_RATING_BUTTON_LABEL_TRANSLATION_KEY,
  RatingBox,
  YES_RATING_BUTTON_LABEL_TRANSLATION_KEY,
} from "../RatingBox";

const YES_RATING = "yes";
const NO_RATING = "no";

describe("RatingBox", () => {
  const FeedbackContextComponent = (props: { children: React.ReactNode }) => {
    const feedbackTranslationMemo = useMemo(
      () => ({
        translations: {
          [YES_RATING_BUTTON_LABEL_TRANSLATION_KEY]: YES_RATING,
          [NO_RATING_BUTTON_LABEL_TRANSLATION_KEY]: NO_RATING,
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
          return json({});
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
          return json({});
        },
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);

    fireEvent.click(getByText(NO_RATING));

    expect(onSubmitMock).toBeCalled();
  });
});
