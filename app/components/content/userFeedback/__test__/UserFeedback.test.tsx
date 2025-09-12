import { render } from "@testing-library/react";
import { act } from "react";
import { createRoutesStub } from "react-router";
import UserFeedback from "~/components/content/userFeedback";

vi.mock("~/components/content/userFeedback/FeedbackFormBox", () => ({
  FeedbackFormBox: () => <div>Mock FeedbackFormBox</div>,
}));

vi.mock("~/components/content/userFeedback/PostSubmissionBox", () => ({
  PostSubmissionBox: () => <div>Mock PostSubmissionBox</div>,
}));

vi.mock("~/components/content/userFeedback/RatingBox", () => ({
  RatingBox: () => <div>Mock RatingBox</div>,
}));

const mockedProps = { rating: { heading: "heading" } };

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("UserFeedback", () => {
  it("renders RatingBox when bannerState is showRating", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      { path: "", Component: () => <UserFeedback {...mockedProps} /> },
    ]);
    const { getByText } = render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: { root: { feedback: { state: "showRating" } } },
        }}
      />,
    );
    expect(getByText("Mock RatingBox")).toBeInTheDocument();
  });

  it("renders FeedbackFormBox when bannerState is showFeedback", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    const { getByText } = render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: "showFeedback" } },
          },
        }}
      />,
    );
    expect(getByText("Mock FeedbackFormBox")).toBeInTheDocument();
  });

  it("renders PostSubmissionBox when bannerState is feedbackGiven", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    const { getByText } = render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: "feedbackGiven", result: true } },
          },
        }}
      />,
    );
    expect(getByText("Mock PostSubmissionBox")).toBeInTheDocument();
  });
});
