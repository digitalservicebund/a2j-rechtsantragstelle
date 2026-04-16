import type { Meta, StoryObj } from "@storybook/react-vite";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";

const meta = {
  title: "kern/KernButtonContainer",
  component: KernButtonContainer,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof KernButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TwoButtons: Story = {
  args: {
    children: (
      <>
        <KernButton>Button 1</KernButton>
        <KernButton look="secondary">Button 2</KernButton>
      </>
    ),
  },
};
