import type { Meta, StoryObj } from "@storybook/react";
import DateInput from "../app/components/inputs/DateInput";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import { RVFProvider } from ".storybook/RVFProvider";

const meta = {
  title: "Component/DateInput",
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
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
};
