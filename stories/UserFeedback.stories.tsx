import type { Meta, StoryObj } from "@storybook/react";
import UserFeedback, { BannerState } from "../app/components/UserFeedback";
import { createRemixStub } from "@remix-run/testing";
import { redirect, redirectDocument } from "@remix-run/node";

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
      const RemixStub = createRemixStub([
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

      return <RemixStub />;
    },
  ],
};
