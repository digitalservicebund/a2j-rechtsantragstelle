import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { createRoutesStub } from "react-router";
import UserFeedback, {
  BannerState,
  USER_FEEDBACK_ID,
} from "~/components/userFeedback";

vi.mock("~/components/userFeedback/FeedbackFormBox", () => ({
  FeedbackFormBox: () => <div>Mock FeedbackFormBox</div>,
}));

vi.mock("~/components/userFeedback/PostSubmissionBox", () => ({
  PostSubmissionBox: () => <div>Mock PostSubmissionBox</div>,
}));

vi.mock("~/components/userFeedback/RatingBox", () => ({
  RatingBox: () => <div>Mock RatingBox</div>,
}));

const mockedProps = {
  rating: {
    heading: "heading",
  },
};

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("UserFeedback", () => {
  it("renders correct id for the url fragment", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: BannerState.ShowFeedback } },
          },
        }}
      />,
    );
    const { id } = screen.getByTestId(USER_FEEDBACK_ID);
    expect(id).toBe(USER_FEEDBACK_ID);
  });

  it("renders RatingBox when bannerState is ShowRating", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: BannerState.ShowRating } },
          },
        }}
      />,
    );
    expect(screen.getByText("Mock RatingBox")).toBeInTheDocument();
  });

  it("renders FeedbackFormBox when bannerState is ShowFeedback", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: BannerState.ShowFeedback } },
          },
        }}
      />,
    );
    expect(screen.getByText("Mock FeedbackFormBox")).toBeInTheDocument();
  });

  it("renders PostSubmissionBox when bannerState is FeedbackGiven", () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: {
              feedback: {
                state: BannerState.FeedbackGiven,
                result: true,
              },
            },
          },
        }}
      />,
    );
    expect(screen.getByText("Mock PostSubmissionBox")).toBeInTheDocument();
  });

  it("sets shouldFocus to true when applyFocus is called", async () => {
    const UserFeedbackWithRouteStub = createRoutesStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
        action: () => new Response(null, { status: 200 }), // Mock action
      },
    ]);

    render(
      <UserFeedbackWithRouteStub
        hydrationData={{
          loaderData: {
            root: { feedback: { state: BannerState.ShowFeedback } },
          },
        }}
      />,
    );

    const feedbackBox = screen.getByTestId("user-feedback-banner");

    await act(async () => {
      await userEvent.click(feedbackBox);
    });
    expect(await screen.findByTestId(USER_FEEDBACK_ID)).toBeInTheDocument();
  });
});
