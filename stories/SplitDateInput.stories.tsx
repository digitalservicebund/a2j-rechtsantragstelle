import type { Meta, StoryObj } from "@storybook/react-vite";
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
    name: "birthDate",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
