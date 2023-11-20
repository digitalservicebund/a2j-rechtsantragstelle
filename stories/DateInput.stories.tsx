import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import DateInput from "../app/components/inputs/DateInput";
const component = DateInput;

const meta = {
  title: "Component/DateInput",
  component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    name: "name",
    label: "Datum",
    formId: "formId",
  },
  decorators: [(Story) => remixContext(Story)],
} satisfies StoryObj<typeof meta>;
export default meta;
