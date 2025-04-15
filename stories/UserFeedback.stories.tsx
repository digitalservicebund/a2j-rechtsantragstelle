import type { Meta, StoryObj } from "@storybook/react";
import UserFeedback from "../app/components/userFeedback";
import { BannerState } from "~/components/userFeedback/BannerState";
import { createRoutesStub } from "react-router";

const meta = {
  title: "Content/UserFeedback",
  component: UserFeedback,
  tags: ["autodocs"],
} satisfies Meta<typeof UserFeedback>;

export default meta;

let bannerStateMemo = BannerState.ShowRating;
const nextBannerState = (bannerState: BannerState) =>
  bannerState === BannerState.ShowRating
    ? BannerState.ShowFeedback
    : BannerState.FeedbackGiven;

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
            return { bannerState };
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
