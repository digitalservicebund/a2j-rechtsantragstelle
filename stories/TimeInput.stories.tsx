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
    label: "arrival time",
    formId: "formId",
    width: "5",
    helperText: "Please write in HH:MM format",
  },
  decorators: [(Story) => remixContext(Story)],
};
