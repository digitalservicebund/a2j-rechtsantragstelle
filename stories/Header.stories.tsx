import type { Meta, StoryObj } from "@storybook/react";
import Header from "~/components/Header";

const meta = {
  title: "Basic/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: {
      text: "Heading",
      tagName: "h3",
      look: "ds-heading-01-reg",
    },
    content: { html: "<p>Lorem <strong>ipsum</strong></p>" },
  },
};
