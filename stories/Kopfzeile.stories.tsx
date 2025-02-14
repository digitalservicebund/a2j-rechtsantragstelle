import Kopfzeile from "~/components/Kopfzeile";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Component/Kopfzeile",
  component: Kopfzeile,
  tags: ["autodocs"],
} satisfies Meta<typeof Kopfzeile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignToMainContainer: true,
  },
};
