import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import IbanInput from "~/components/formElements/inputs/iban/IbanInput";

const meta = {
  title: "form/inputs/IbanInput",
  component: IbanInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IbanInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "iban",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
