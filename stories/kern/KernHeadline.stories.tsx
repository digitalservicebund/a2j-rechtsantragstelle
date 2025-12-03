import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHeadline from "~/components/kern/KernHeadline";

const meta = {
  title: "kern/KernHeadline",
  component: KernHeadline,
  tags: ["autodocs"],
  argTypes: {
    tagName: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"],
    },
  },
} satisfies Meta<typeof KernHeadline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "This is a Headline",
    tagName: "h1",
  },
};

export const AsH2: Story = {
  args: {
    text: "Headline as H2",
    tagName: "h2",
  },
};
