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
    rating: {
      heading: "Hat Ihnen der Vorab-Check geholfen?",
      yesButtonLabel: "Ja",
      noButtonLabel: "Nein",
    },
    feedback: {
      heading: "Haben sie Verbesserungsvorschläge",
      placeholder: "Bitte tragen Sie keine persönlichen Daten ein!",
      abortButtonLabel: "Abbrechen",
      submitButtonLabel: "Abschicken",
    },
    postSubmission: {
      heading: "Vielen Dank!",
      text: "Ihr Feedback hilft uns, diese Seite für alle Nutzenden zu verbessern!",
    },
  },
  decorators: [(Story) => remixContext(Story)],
};
