import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import Textarea from "../app/components/inputs/Textarea";

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
    formId: "formId",
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithDescription: Story = {
  args: {
    name: "textarea",
    description: "Lorem **ipsum**\n\n* _Lorem ipsum_\n* _Lorem ipsum_",
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithTextHint: Story = {
  args: {
    name: "textarea",
    textHint: {
      title: "Text-Beispiel",
      content: "Lorem ipsum",
    },
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
  },
  decorators: [(Story) => remixContext(Story)],
};
