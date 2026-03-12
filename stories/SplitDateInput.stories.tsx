import type { Meta, StoryObj } from "@storybook/react-vite";
import SplitDateInput from "../app/components/formElements/SplitDateInput";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import z from "zod";

const meta = {
  title: "FormElements/SplitDateInput",
  component: SplitDateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitDateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "date" },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <Story />,
        z.object({ date: createSplitDateSchema() }),
      ),
  ],
};
