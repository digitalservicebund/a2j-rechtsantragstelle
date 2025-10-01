import type { Meta, StoryObj } from "@storybook/react";
import SplitDateInput from "../app/components/formElements/SplitDateInput";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";

const meta = {
  title: "FormElements/DateSplitInput",
  component: SplitDateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitDateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "geburstdatum",
    legend: "Geburtsdatum",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
