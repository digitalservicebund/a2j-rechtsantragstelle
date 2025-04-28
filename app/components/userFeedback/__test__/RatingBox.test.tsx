import { fireEvent, render } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { FeedbackType } from "../FeedbackType";
import { RatingBox } from "../RatingBox";

describe("RatingBox", () => {
  it("should call onSubmit method when any button is clicked", () => {
    const onSubmitMock = vitest.fn();
    const RatingBoxWithRouteStub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <RatingBox heading="heading" url="/url" onSubmit={onSubmitMock} />
        ),
      },
      {
        path: "/action/send-rating",
        action() {
          return {};
        },
      },
    ]);
    const { getByText } = render(<RatingBoxWithRouteStub />);
    fireEvent.click(getByText("Ja"));
    expect(onSubmitMock).toBeCalledWith(FeedbackType.Positive);
    fireEvent.click(getByText("Nein"));
    expect(onSubmitMock).toBeCalledWith(FeedbackType.Negative);
  });
});
