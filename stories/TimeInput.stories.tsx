import type { Meta, StoryObj } from "@storybook/react";
import TimeInput from "../app/components/inputs/TimeInput";
import { remixContext } from "../.storybook/remixContext";

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
    label: <span>arrival time</span>,
    formId: "formId",
    helperText: "Please write in HH:MM format",
    width: "5",
  },
  decorators: [(Story) => remixContext(Story)],
};
