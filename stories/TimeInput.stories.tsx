import type { Meta, StoryObj } from "@storybook/react";
import TimeInput from "../app/components/inputs/TimeInput";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";

const meta = {
  title: "Component/TimeInput",
  component: TimeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "arrivalTime",
    label: "arrival time",
    width: "5",
    helperText: "Please write in HH:MM format",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};
