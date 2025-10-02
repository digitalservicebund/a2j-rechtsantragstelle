import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import Select from "../app/components/formElements/Select";

const meta = {
  title: "FormElements/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
    placeholder: undefined,
    errorMessages: undefined,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithPlaceholder: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
    placeholder: "Placeholder",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
