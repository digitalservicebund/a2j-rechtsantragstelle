import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render } from "@testing-library/react";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";
import {
  NO_RATING_BUTTON_LABEL_TRANSLATION_KEY,
  RatingBox,
  YES_RATING_BUTTON_LABEL_TRANSLATION_KEY,
} from "../RatingBox";

const YES_RATING = "yes";
const NO_RATING = "no";

const TRANSLATION_KEY_RECORD = {
  [YES_RATING_BUTTON_LABEL_TRANSLATION_KEY]: YES_RATING,
  [NO_RATING_BUTTON_LABEL_TRANSLATION_KEY]: NO_RATING,
};

describe("RatingBox", () => {
  it("should render the component with the given translations", () => {
    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackTranslationContext.Provider
            value={{ translations: TRANSLATION_KEY_RECORD }}
          >
            <RatingBox heading="heading" url="url" onSubmit={vitest.fn} />
          </FeedbackTranslationContext.Provider>
        ),
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);

    expect(getByText(YES_RATING)).toBeInTheDocument();
    expect(getByText(NO_RATING)).toBeInTheDocument();
  });

  it("should call onSubmit method when clicks on the Yes button", () => {
    const obSubmitMock = vitest.fn();

    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackTranslationContext.Provider
            value={{ translations: TRANSLATION_KEY_RECORD }}
          >
            <RatingBox heading="heading" url="url" onSubmit={obSubmitMock} />
          </FeedbackTranslationContext.Provider>
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

    expect(obSubmitMock).toBeCalled();
  });

  it("should call obSubmit method when clicks on the No button", () => {
    const obSubmitMock = vitest.fn();

    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <FeedbackTranslationContext.Provider
            value={{ translations: TRANSLATION_KEY_RECORD }}
          >
            <RatingBox heading="heading" url="url" onSubmit={obSubmitMock} />
          </FeedbackTranslationContext.Provider>
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

    expect(obSubmitMock).toBeCalled();
  });
});
