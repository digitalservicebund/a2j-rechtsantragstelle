import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { FeedbackTranslationContext } from "../FeedbackTranslationContext";
import { RatingBox } from "../RatingBox";

const YES_RATING = "yes";
const NO_RATING = "no";

const TRANSLATION_KEY_RECORD = {
  "yes-rating": YES_RATING,
  "no-rating": NO_RATING,
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
            <RatingBox heading="heading" url="url" />
          </FeedbackTranslationContext.Provider>
        ),
      },
    ]);
    const { getByText } = render(<RatingBoxWithRemixStub />);

    expect(getByText(YES_RATING)).toBeInTheDocument();
    expect(getByText(NO_RATING)).toBeInTheDocument();
  });
});
