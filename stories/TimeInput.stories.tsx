import type { Meta, StoryObj } from "@storybook/react-vite";
import TimeInput from "../app/components/formElements/TimeInput";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";

const meta = {
  title: "FormElements/TimeInput",
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
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
