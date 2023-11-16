import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "../app/components/inputs/Checkbox";
import { remixContext } from "../.storybook/remixContext";
const component = Checkbox;

const meta = {
  title: "Component/Checkbox",
  component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    name: "name",
    value: "value",
    label: "label",
    formId: "formId",
  },
  decorators: [(Story) => remixContext(Story)],
} satisfies StoryObj<typeof meta>;
export default meta;
