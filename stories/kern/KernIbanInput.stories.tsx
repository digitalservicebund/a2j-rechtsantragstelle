import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import KernIbanInput from "~/components/kern/formElements/input/KernIbanInput";

const meta = {
  title: "FormElements/KernIbanInput",
  component: KernIbanInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernIbanInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "iban",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
