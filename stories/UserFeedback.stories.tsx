import type { Meta, StoryObj } from "@storybook/react-vite";
import UserFeedback from "~/components/content/userFeedback";
import { type BannerState } from "~/components/content/userFeedback/BannerState";
import { createRoutesStub } from "react-router";

const meta = {
  title: "Content/UserFeedback",
  component: UserFeedback,
  tags: ["autodocs"],
} satisfies Meta<typeof UserFeedback>;

export default meta;

let bannerStateMemo = "showRating" as BannerState;
const nextBannerState = (bannerState: BannerState) =>
  bannerState === "showRating"
    ? "showFeedback"
    : ("feedbackGiven" as BannerState);

export const Example: StoryObj<typeof meta> = {
  args: {
    rating: { heading: "Hat Ihnen der Vorab-Check geholfen?" },
  },
  decorators: [
    (Story) => {
      const RouteStub = createRoutesStub([
        {
          id: "root",
          loader: () => {
            const bannerState = bannerStateMemo;
            bannerStateMemo = nextBannerState(bannerStateMemo);
            return { feedback: { state: bannerState, result: "positive" } };
          },
          children: [
            { path: "/", Component: Story },
            {
              path: "/action/send-rating",
              action: () => ({ success: true }),
            },
            {
              Component: Story, // This is a workaround for FeedbackFormBox redirecting to /action/send-feedback
              path: "/action/send-feedback",
              action: () => ({ success: true }),
            },
          ],
        },
      ]);

      return <RouteStub />;
    },
  ],
};
