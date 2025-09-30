import type { Meta, StoryObj } from "@storybook/react";
import DateSplitInput from "../app/components/formElements/DateSplitInput";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";

const meta = {
  title: "FormElements/DateSplitInput",
  component: DateSplitInput,
  tags: ["autodocs"],
} satisfies Meta<typeof DateSplitInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "geburstdatum",
    legend: "Geburtsdatum",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
