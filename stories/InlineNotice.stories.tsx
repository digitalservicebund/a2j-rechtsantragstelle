import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineNotice } from "~/components/content/InlineNotice";

const meta = {
  title: "Content/InlineNotice",
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
    title: "Achtung!",
    tagName: "h2",
    content:
      "Geben Sie unbedingt den vollständigen Namen einschließlich der in der Bezeichnung enthaltenen Rechtsform, zum Beispiel “ABC GmbH” an.",
  },
  decorators: [(Story) => <Story />],
};

export const WarningAndMarkdown: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "warning",
    title: "Achtung!",
    tagName: "h2",
    content:
      "Lorem **ipsum**\n\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
  },
  decorators: [(Story) => <Story />],
};

export const Tips: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "tips",
    title: "Achtung!",
    tagName: "h2",
    content:
      "Geben Sie unbedingt den vollständigen Namen einschließlich der in der Bezeichnung enthaltenen Rechtsform, zum Beispiel “ABC GmbH” an.",
  },
  decorators: [(Story) => <Story />],
};

export const TipsAndMarkdown: Story = {
  args: {
    identifier: "default-inline-notice-id",
    look: "tips",
    title: "Achtung!",
    tagName: "h2",
    content:
      "Lorem **ipsum**\n\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt\n* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
  },
  decorators: [(Story) => <Story />],
};
