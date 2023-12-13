import type { Meta, StoryObj } from "@storybook/react";
import { Notification } from "../app/components/Notification";
import Background from "../app/components/Background";
import Container from "../app/components/Container";

const meta = {
  title: "Page/Notification",
  component: Notification,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Notification>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    (Story) => (
      <Background paddingTop="32" paddingBottom="32">
        <Container paddingTop="32" paddingBottom="40">
          <Story />
        </Container>
      </Background>
    ),
  ],
  args: {
    identifier: "default-notification-id",
    look: "hint",
    heading: {
      text: "Hinweis",
      tagName: "h2",
      look: "ds-label-01-bold",
    },
    content: {
      markdown:
        "Geben Sie unbedingt den vollständigen Namen einschließlich der in der Bezeichnung enthaltenen Rechtsform, zum Beispiel “ABC GmbH” an.",
    },
  },
};
