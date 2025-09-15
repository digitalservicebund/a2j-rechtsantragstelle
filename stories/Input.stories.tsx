import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import Input from "../app/components/formElements/Input";

const meta = {
  title: "FormElements/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    type: "text",
    placeholder: "placeholder",
    prefix: undefined,
    suffix: undefined,
    errorMessages: undefined,
    helperText: undefined,
    width: undefined,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithPrefix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    prefix: "€",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithSuffix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    suffix: "€",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithHelperText: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    helperText: "Helper",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
