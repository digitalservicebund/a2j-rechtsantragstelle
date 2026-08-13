import type { Meta, StoryObj } from "@storybook/react-vite";
import Kopfzeile from "~/components/layout/Kopfzeile";

const meta = {
  title: "layout/Kopfzeile",
  component: Kopfzeile,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Kopfzeile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
