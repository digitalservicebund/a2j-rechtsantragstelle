import type { StoryObj } from "@storybook/react-vite";
import Checkbox from "../app/components/formElements/Checkbox";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "FormElements/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    name: "name",
    label: "label",
    required: true,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
} satisfies StoryObj<typeof meta>;
export default meta;
