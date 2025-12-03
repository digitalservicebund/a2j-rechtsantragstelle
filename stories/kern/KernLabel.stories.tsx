import type { Meta, StoryObj } from "@storybook/react-vite";
import KernLabel from "~/components/content/kern/KernLabel";

const meta = {
  title: "kern/KernLabel",
  component: KernLabel,
  tags: ["autodocs"],
  argTypes: {
    tagName: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"],
    },
  },
} satisfies Meta<typeof KernLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Label Text",
    tagName: "h1",
  },
};

export const AsH2: Story = {
  args: {
    text: "Label as H2",
    tagName: "h2",
  },
};
