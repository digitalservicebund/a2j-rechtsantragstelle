import type { Meta, StoryObj } from "@storybook/react";
import Background from "../app/components/layout/Background";

const meta = {
  title: "Layout/Background",
  component: Background,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Background>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Lorem ipsum",
  },
};

export const BackgroundColor: Story = {
  args: {
    children: "Lorem ipsum",
    backgroundColor: "blue",
  },
};

export const Paddings: Story = {
  args: {
    children: "Lorem ipsum",
    paddingTop: "32",
    paddingBottom: "48",
  },
};
