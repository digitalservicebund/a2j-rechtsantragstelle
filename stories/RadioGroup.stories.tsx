import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import RadioGroup from "~/components/formElements/RadioGroup";
import { RVFProvider } from ".storybook/RVFProvider";

const meta = {
  title: "Component/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
    label: undefined,
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
    errorMessages: undefined,
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

export const WithLabel: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
    ],
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
