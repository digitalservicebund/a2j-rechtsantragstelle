import type { Meta, StoryObj } from "@storybook/react";
import Accordion from "../app/components/Accordion";
import Background from "../app/components/Background";
import Container from "../app/components/Container";

const meta = {
  title: "Page/Accordion",
  component: Accordion,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

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
    items: [
      {
        id: 1,
        title: "Accordion Item 1",
        description:
          "This is the description for accordion item 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        id: 2,
        title: "Accordion Item 2",
        description:
          "This is the description for accordion item 2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 3,
        title: "Accordion Item 3",
        description:
          "This is the description for accordion item 3. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
    className: "my-custom-class",
  },
};
