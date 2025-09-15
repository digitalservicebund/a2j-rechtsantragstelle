import type { Meta, StoryObj } from "@storybook/react";
import DateInput from "../app/components/formElements/DateInput";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";

const meta = {
  title: "FormElements/DateInput",
  component: DateInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "birthday",
    label: "Geburtsdatum",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
