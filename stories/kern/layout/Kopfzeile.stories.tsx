import type { Meta, StoryObj } from "@storybook/react-vite";
import KernKopfzeile from "~/components/kern/layout/KernKopfzeile";

const meta = {
  title: "kern/layout/KernKopfzeile",
  component: KernKopfzeile,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof KernKopfzeile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
