import type { Meta, StoryObj } from "@storybook/react";
import { InlineNotice } from "../app/components/InlineNotice";

const meta = {
  title: "Basic/InlineNotice",
  component: InlineNotice,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "warning",
    heading: {
      text: "Hinweis",
      tagName: "h2",
      look: "ds-label-01-bold",
    },
    content:
      "Geben Sie unbedingt den vollständigen Namen einschließlich der in der Bezeichnung enthaltenen Rechtsform, zum Beispiel “ABC GmbH” an.",
  },
  decorators: [(Story) => <Story />],
};

export const WarningAndMarkdown: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "warning",
    heading: {
      text: "Hinweis",
      tagName: "h2",
      look: "ds-label-01-bold",
    },
    content:
      "Lorem **ipsum**\n\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
  },
  decorators: [(Story) => <Story />],
};

export const Tips: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "tips",
    heading: {
      text: "Tips",
      tagName: "h2",
      look: "ds-label-01-bold",
    },
    content:
      "Geben Sie unbedingt den vollständigen Namen einschließlich der in der Bezeichnung enthaltenen Rechtsform, zum Beispiel “ABC GmbH” an.",
  },
  decorators: [(Story) => <Story />],
};

export const TipsAndMarkdown: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "tips",
    heading: {
      text: "Tips",
      tagName: "h2",
      look: "ds-label-01-bold",
    },
    content:
      "Lorem **ipsum**\n\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
  },
  decorators: [(Story) => <Story />],
};
