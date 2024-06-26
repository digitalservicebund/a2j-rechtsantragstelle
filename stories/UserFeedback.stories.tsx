import type { Meta, StoryObj } from "@storybook/react";
import UserFeedback, { BannerState } from "../app/components/UserFeedback";
import { remixContext } from "../.storybook/remixContext";

const meta = {
  title: "Content/UserFeedback",
  component: UserFeedback,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserFeedback>;

export default meta;

export const Example: StoryObj<typeof meta> = {
  args: {
    bannerState: BannerState.ShowRating,
    rating: {
      heading: "Hat Ihnen der Vorab-Check geholfen?",
    },
  },
  decorators: [(Story) => remixContext(Story)],
};
