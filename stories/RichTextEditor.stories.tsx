import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import RichTextEditor from "../app/components/formElements/RichTextEditor";
import z from "zod";

const meta = {
  title: "FormElements/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "richText",
    label: "Rich Text Content",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDescription: Story = {
  args: {
    name: "richText",
    description:
      "Use the toolbar to apply **bold**, *italic*, or <u>underline</u> formatting to your text.",
    label: "Rich Text Content",
    placeholder: "Start typing your content...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDetails: Story = {
  args: {
    name: "richText",
    details: {
      title: "Formatting Options",
      content:
        "You can format your text using bold, italic, and underline. Simply select the text and click the corresponding button in the toolbar.",
    },
    label: "Rich Text Content",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const schema = z.object({
  richText: z.string().min(1, { message: "Content required" }),
});

export const WithError: Story = {
  args: {
    name: "richText",
    label: "Rich Text Content",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, schema)],
};
