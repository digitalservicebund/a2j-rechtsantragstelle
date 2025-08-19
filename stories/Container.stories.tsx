import type { Meta, StoryObj } from "@storybook/react";
import Container from "../app/components/layout/Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

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

export const OverhangingBackground: Story = {
  args: {
    children: "Lorem ipsum",
    backgroundColor: "blue",
    overhangingBackground: true,
  },
};

export const CustomPaddings: Story = {
  args: {
    children: "Lorem ipsum",
    paddingTop: "8",
    paddingBottom: "16",
  },
};
