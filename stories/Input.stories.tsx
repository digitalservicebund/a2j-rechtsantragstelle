import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import Input from "../app/components/inputs/Input";

const meta = {
  title: "Component/Input",
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
    formId: "formId",
    type: "text",
    placeholder: "placeholder",
    prefix: undefined,
    suffix: undefined,
    errorMessages: undefined,
    helperText: undefined,
    width: undefined,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithPrefix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
    prefix: "€",
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithSuffix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
    suffix: "€",
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithHelperText: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
    helperText: "Helper",
  },
  decorators: [(Story) => remixContext(Story)],
};
