import type { Meta, StoryObj } from "@storybook/react";
import Container from "../app/components/Container";
import InfoBoxItem, { InfoBoxItemProps } from "~/components/InfoBoxItem";

const meta = {
  title: "Content/InfoBoxItem",
  component: InfoBoxItem,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoBoxItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs: InfoBoxItemProps = {
  identifier: "default-info-box-item-id",
  headline: {
    text: "InfoBoxItem Header",
  },
  content: "InfoBoxItem Content",
};

export const Default: Story = {
  args: defaultArgs,
};

export const InContainer: Story = {
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
  args: defaultArgs,
};

export const WithInlineNotice: Story = {
  args: {
    ...defaultArgs,
    inlineNotices: [
      {
        title: "InlineNotice Title",
        tagName: "h3",
        look: "tips",
        content: "Lorem **ipsum**\n\n* Lorem ipsum\n* Lorem ipsum",
      },
    ],
  },
};
