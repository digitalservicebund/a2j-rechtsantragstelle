import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHeading from "~/components/content/kern/KernHeading";

const meta = {
  title: "kern/KernHeading",
  component: KernHeading,
  tags: ["autodocs"],
  argTypes: {
    tagName: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"],
    },
  },
} satisfies Meta<typeof KernHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "This is a Heading",
    tagName: "h1",
  },
};

export const AsH2: Story = {
  args: {
    text: "Heading as H2",
    tagName: "h2",
  },
};
