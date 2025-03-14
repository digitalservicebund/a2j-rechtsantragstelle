import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render } from "@testing-library/react";
import { RatingBox } from "../RatingBox";

const YES_RATING = "yes";
const NO_RATING = "no";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    ["yes-rating"]: YES_RATING,
    ["no-rating"]: NO_RATING,
  }),
}));

describe("RatingBox", () => {
  it("should render the component with the given translations", () => {
    const RatingBoxWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <RatingBox heading="heading" url="url" onSubmit={vitest.fn()} />
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
          <RatingBox heading="heading" url="url" onSubmit={onSubmitMock} />
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
          <RatingBox heading="heading" url="url" onSubmit={onSubmitMock} />
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
