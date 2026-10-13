import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import IbanInput from "~/components/formElements/inputs/iban/IbanInput";
import { kontopfaendungPkontoAntragPages } from "~/domains/kontopfaendung/pkonto/antrag/pages";

const meta = {
  title: "form/inputs/IbanInput",
  component: IbanInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
    },
  },
} satisfies Meta<typeof IbanInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "iban",

    controlledFieldConfig:
      kontopfaendungPkontoAntragPages.bankdatenKontodaten.controlledFieldConfig,

    size: "medium",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
