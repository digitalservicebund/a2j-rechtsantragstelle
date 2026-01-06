import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import { RatingBox } from "~/components/kern/UserFeedback/RatingBox";
import { FeedbackFormBox } from "~/components/kern/UserFeedback/FeedbackFormBox";
import { PostSubmissionBox } from "~/components/kern/UserFeedback/PostSubmissionBox";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { reactRouterContext } from ".storybook/reactRouterContext";

type BannerState = "showRating" | "showFeedback" | "feedbackGiven";
type FeedbackType = "positive" | "negative";

const InteractiveFeedbackComponent = () => {
  const [bannerState, setBannerState] = useState<BannerState>("showRating");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("positive");
  const [shouldFocus, setShouldFocus] = useState(false);

  // Intercept form submissions to prevent actual navigation
  useEffect(() => {
    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (form.action.includes("/action/send-feedback")) {
        e.preventDefault();
        e.stopPropagation();
        handleFeedbackSubmit();
      }
    };

    document.addEventListener("submit", handleSubmit, true);
    return () => document.removeEventListener("submit", handleSubmit, true);
  }, []);

  const handleRatingSubmit = (feedback: FeedbackType) => {
    setFeedbackType(feedback);
    setBannerState("showFeedback");
    setShouldFocus(true);
  };

  const handleFeedbackSubmit = () => {
    setBannerState("feedbackGiven");
    setShouldFocus(true);
  };

  const resetDemo = () => {
    setBannerState("showRating");
    setShouldFocus(false);
  };

  return (
    <GridSection>
      <Grid>
        <GridItem
          smColumn={{ start: 1, span: 12 }}
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="rounded-lg"
        >
          <article className="kern-card kern-card--interactive kern-card--small">
            <div className="kern-card__container">
              {bannerState === "showRating" && (
                <RatingBox
                  url="/"
                  heading="War diese Seite hilfreich?"
                  onSubmit={handleRatingSubmit}
                />
              )}
              {bannerState === "showFeedback" && (
                <FeedbackFormBox
                  destination="/"
                  shouldFocus={shouldFocus}
                  feedback={feedbackType}
                  onSubmit={handleFeedbackSubmit}
                />
              )}
              {bannerState === "feedbackGiven" && (
                <PostSubmissionBox
                  shouldFocus={shouldFocus}
                  postSubmissionText="Vielen Dank für Ihre Rückmeldung! Wir nutzen Ihr Feedback, um unsere Services zu verbessern."
                />
              )}
            </div>
          </article>
          {bannerState === "feedbackGiven" && (
            <div className="mt-4">
              <button
                onClick={resetDemo}
                className="kern-button kern-button--primary"
              >
                Demo zurücksetzen
              </button>
            </div>
          )}
        </GridItem>
      </Grid>
    </GridSection>
  );
};

const meta = {
  title: "kern/UserFeedback/InteractiveFeedback",
  component: InteractiveFeedbackComponent,
  tags: ["autodocs"],
  decorators: [(Story) => reactRouterContext(Story)],
  parameters: {
    docs: {
      description: {
        component:
          "Interactive demo showing the complete user feedback flow. Click 'Ja' or 'Nein' to see the feedback form, then submit to see the success message.",
      },
    },
  },
} satisfies Meta<typeof InteractiveFeedbackComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
