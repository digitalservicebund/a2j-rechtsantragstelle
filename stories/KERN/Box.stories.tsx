import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "~/components/kern/KernBox";

const meta = {
  title: "Kern/Box",
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
      <div className="bg-kern-neutral-050">
        <Story />
      </div>
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
