import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import Input from "../app/components/formElements/Input";
import { RVFProvider } from ".storybook/RVFProvider";

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
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
};

export const WithPrefix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    prefix: "€",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
};

export const WithSuffix: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    suffix: "€",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
};

export const WithHelperText: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    helperText: "Helper",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RVFProvider>
          <Story />
        </RVFProvider>
      )),
  ],
};
