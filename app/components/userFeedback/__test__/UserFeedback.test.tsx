import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
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
            root: { data: { bannerState: BannerState.ShowFeedback } },
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
            root: { data: { bannerState: BannerState.ShowRating } },
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
            root: { data: { bannerState: BannerState.ShowFeedback } },
          },
        }}
      />,
    );
    expect(screen.getByTestId("SendOutlinedIcon")).toBeInTheDocument();
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
            root: { data: { bannerState: BannerState.FeedbackGiven } },
          },
        }}
      />,
    );
    expect(screen.getByTestId("user-feedback-submission")).toBeInTheDocument();
  });
});
