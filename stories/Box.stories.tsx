import type { Meta, StoryObj } from "@storybook/react";
import Box from "../app/components/Box";
import Background from "../app/components/Background";
import Container from "../app/components/Container";

const meta = {
  title: "Content/Box",
  component: Box,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <Background backgroundColor="blue" paddingTop="32" paddingBottom="32">
        <Container backgroundColor="yellow" paddingTop="32" paddingBottom="40">
          <Story />
        </Container>
      </Background>
    ),
  ],
  args: {
    identifier: "default-box-id",
    label: {
      text: "Label text",
      tagName: "p",
      look: "ds-label-02-reg",
    },
    heading: {
      text: "Heading text",
      tagName: "h2",
      look: "ds-heading-03-bold",
    },
    content: {
      html: "Lorem <strong>ipsum</strong>\n\n<ul> <li>Lorem ipsum</li>\n<li>Lorem ipsum</li></ul>",
    },
    buttons: [{ text: "Button 1", look: "tertiary" }, { text: "Button 2" }],
  },
};
