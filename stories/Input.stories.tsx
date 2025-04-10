import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import Input from "../app/components/inputs/Input";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";

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
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
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
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
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
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
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
      remixContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};
