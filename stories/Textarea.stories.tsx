import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import Textarea from "../app/components/formElements/Textarea";
import z from "zod";

const meta = {
  title: "FormElements/Textarea",
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
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDescription: Story = {
  args: {
    name: "textarea",
    description: "Lorem **ipsum**\n\n* _Lorem ipsum_\n* _Lorem ipsum_",
    label: "Lorem ipsum dolor sit amet",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDetails: Story = {
  args: {
    name: "textarea",
    details: {
      title: "Text-Beispiel",
      content: "Lorem ipsum",
    },
    label: "Lorem ipsum dolor sit amet",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const schema = z.object({
  textarea: z.string().min(1, { message: "Information required" }),
});

export const WithError: Story = {
  args: {
    name: "textarea",
    label: "With error",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, schema)],
};
