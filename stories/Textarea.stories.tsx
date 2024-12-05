import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import Textarea from "../app/components/inputs/Textarea";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";

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
    maxCharacterLimit: TEXTAREA_CHAR_LIMIT,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const WithDescription: Story = {
  args: {
    name: "textarea",
    description: "Lorem **ipsum**\n\n* _Lorem ipsum_\n* _Lorem ipsum_",
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
    maxCharacterLimit: TEXTAREA_CHAR_LIMIT,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const Withdetails: Story = {
  args: {
    name: "textarea",
    details: {
      title: "Text-Beispiel",
      content: "Lorem ipsum",
    },
    label: "Lorem ipsum dolor sit amet",
    formId: "formId",
    maxCharacterLimit: TEXTAREA_CHAR_LIMIT,
  },
  decorators: [(Story) => remixContext(Story)],
};
