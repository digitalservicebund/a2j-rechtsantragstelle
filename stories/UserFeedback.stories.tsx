import type { Meta, StoryObj } from "@storybook/react";
import UserFeedback from "../app/components/UserFeedback";

const meta = {
  title: "Content/UserFeedback",
  component: UserFeedback,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserFeedback>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    heading: {
      text: "Hat Ihnen der Vorab-Check geholfen?",
      look: "ds-label-01-bold",
      tagName: "h1"
    },
    yesButtonLabel: "Ja",
    noButtonLabel: "Nein",
    successHeading: {
      text: "Vielen Dank!",
      look: "ds-label-01-bold",
      tagName: "h1"
    },
    successText: {
      markdown: "Ihr Feedback hilft uns, diese Seite für alle Nutzenden zu verbessern!"
    }
  },
};

