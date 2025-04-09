import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import Select from "../app/components/inputs/Select";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";

const meta = {
  title: "Component/Select",
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
    formId: "formId",
    label: "Lorem ipsum dolor sit amet",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
    placeholder: undefined,
    errorMessages: undefined,
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

export const WithPlaceholder: Story = {
  args: {
    name: "input",
    formId: "formId",
    label: "Lorem ipsum dolor sit amet",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
    placeholder: "Placeholder",
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
