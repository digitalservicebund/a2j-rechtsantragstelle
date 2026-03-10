import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import IbanInput from "~/components/formElements/IbanInput";

const meta = {
  title: "FormElements/IbanInput",
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
