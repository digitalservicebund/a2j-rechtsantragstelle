import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import Textarea from "../app/components/inputs/Textarea";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";

const meta = {
  title: "Component/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "textarea",
    label: "Lorem ipsum dolor sit amet",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};

export const WithDescription: Story = {
  args: {
    name: "textarea",
    description: "Lorem **ipsum**\n\n* _Lorem ipsum_\n* _Lorem ipsum_",
    label: "Lorem ipsum dolor sit amet",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};

export const Withdetails: Story = {
  args: {
    name: "textarea",
    details: {
      title: "Text-Beispiel",
      content: "Lorem ipsum",
    },
    label: "Lorem ipsum dolor sit amet",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
};
