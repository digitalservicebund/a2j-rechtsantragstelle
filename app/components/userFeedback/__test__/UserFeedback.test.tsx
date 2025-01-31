import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import UserFeedback, {
  BannerState,
  USER_FEEDBACK_ID,
} from "~/components/userFeedback";

describe("UserFeedback", () => {
  const mockedProps = {
    rating: {
      heading: "heading",
    },
  };

  it("renders correct id for the url fragment", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: { bannerState: { state: BannerState.ShowFeedback } },
          },
        }}
      />,
    );
    const { id } = screen.getByTestId(USER_FEEDBACK_ID);
    expect(id).toBe(USER_FEEDBACK_ID);
  });

  it("renders RatingBox when bannerState is ShowRating", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: { bannerState: { state: BannerState.ShowRating } },
          },
        }}
      />,
    );
    expect(screen.getByTestId("ThumbUpOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ThumbDownOutlinedIcon")).toBeInTheDocument();
  });

  it("renders FeedbackFormBox when bannerState is ShowFeedback", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: { bannerState: { state: BannerState.ShowFeedback } },
          },
        }}
      />,
    );
    expect(screen.getByTestId("user-feedback-banner")).toBeInTheDocument();
  });

  it("renders PostSubmissionBox when bannerState is FeedbackGiven", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);
    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: {
              bannerState: {
                state: BannerState.FeedbackGiven,
                feedbackResult: true,
              },
            },
          },
        }}
      />,
    );
    expect(screen.getByTestId("user-feedback-submission")).toBeInTheDocument();
  });

  it("sets shouldFocus to true when applyFocus is called", async () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
        action: () => new Response(null, { status: 200 }), // Mock action
      },
    ]);

    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: { bannerState: { state: BannerState.ShowFeedback } },
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

  it("renders rating buttons when in ShowRating state", async () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => <UserFeedback {...mockedProps} />,
      },
    ]);

    render(
      <UserFeedbackWithRemixStub
        hydrationData={{
          loaderData: {
            root: {
              bannerState: {
                state: BannerState.ShowRating,
                feedbackResult: null,
              },
            },
          },
        }}
      />,
    );

    const buttonContainer = await screen.findByTestId("buttonContainer");
    expect(buttonContainer).toBeInTheDocument();
  });
});
