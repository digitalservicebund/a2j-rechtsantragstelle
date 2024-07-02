import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { useMemo, type ReactNode } from "react";
import UserFeedback, {
  BannerState,
  USER_FEEDBACK_ID,
} from "~/components/UserFeedback";
import { UserFeedbackContext } from "../UserFeedbackContext";

interface RenderUserFeedBackWithContextProps {
  bannerState: BannerState;
  children: ReactNode;
}

const RenderUserFeedBackWithContext = ({
  bannerState,
  children,
}: RenderUserFeedBackWithContextProps) => {
  const bannerStateValue = useMemo(() => ({ bannerState }), [bannerState]);
  return (
    <UserFeedbackContext.Provider value={bannerStateValue}>
      {children}
    </UserFeedbackContext.Provider>
  );
};

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
        Component: () => (
          <RenderUserFeedBackWithContext bannerState={BannerState.ShowRating}>
            <UserFeedback {...mockedProps} />
          </RenderUserFeedBackWithContext>
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    const { id } = screen.getByTestId(USER_FEEDBACK_ID);
    expect(id).toBe(USER_FEEDBACK_ID);
  });

  it("renders RatingBox when bannerState is ShowRating", () => {
    const UserFeedbackWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <RenderUserFeedBackWithContext bannerState={BannerState.ShowRating}>
            <UserFeedback {...mockedProps} />
          </RenderUserFeedBackWithContext>
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
          <RenderUserFeedBackWithContext bannerState={BannerState.ShowFeedback}>
            <UserFeedback {...mockedProps} />
          </RenderUserFeedBackWithContext>
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
          <RenderUserFeedBackWithContext
            bannerState={BannerState.FeedbackGiven}
          >
            <UserFeedback {...mockedProps} />
          </RenderUserFeedBackWithContext>
        ),
      },
    ]);
    render(<UserFeedbackWithRemixStub />);
    expect(screen.getByTestId("user-feedback-submission")).toBeInTheDocument();
  });
});
