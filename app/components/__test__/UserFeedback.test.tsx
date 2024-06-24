import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import UserFeedback, { BannerState } from "~/components/UserFeedback";

describe("UserFeedback", () => {
  const mockedProps = {
    rating: {
      heading: "heading",
      yesButtonLabel: "Ja",
      noButtonLabel: "Nein",
      context: "flowId",
    },
    feedback: {
      heading: "heading",
      placeholder: "placeholder",
      abortButtonLabel: "cancel",
      submitButtonLabel: "submit",
    },
    postSubmission: {
      heading: "heading",
      text: "text",
    },
  };

  it("renders correct id for the url fragment", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <UserFeedback bannerState={BannerState.ShowRating} {...mockedProps} />
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    const { id } = screen.getByTestId("user-feedback-banner");
    expect(id).toBe("user-feedback-banner");
  });

  it("renders RatingBox when bannerState is ShowRating", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <UserFeedback bannerState={BannerState.ShowRating} {...mockedProps} />
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    expect(screen.getByTestId("ThumbUpOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ThumbDownOutlinedIcon")).toBeInTheDocument();
  });

  it("renders FeedbackFormBox when bannerState is ShowFeedback", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <UserFeedback
            bannerState={BannerState.ShowFeedback}
            {...mockedProps}
          />
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    expect(screen.getByTestId("SendOutlinedIcon")).toBeInTheDocument();
  });

  it("renders PostSubmissionBox when bannerState is FeedbackGiven", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <UserFeedback
            bannerState={BannerState.FeedbackGiven}
            {...mockedProps}
          />
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    expect(screen.getByTestId("user-feedback-submission")).toBeInTheDocument();
  });
});
