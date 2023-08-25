import type { Meta, StoryObj } from "@storybook/react";
import Footer from "../app/components/Footer";

const meta = {
  title: "Page/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    image: {
      url: "https://placehold.co/240x132/png",
    },
    paragraphs: [
      { markdown: "Lorem ipsum 1 [Link](/)" },
      { markdown: "Lorem ipsum 2 [Link](/)" },
    ],
    links: [
      {
        url: "https://digitalservice.bund.de",
        openInNewTab: true,
        text: "DigitalService",
      },
      { url: "/", text: "Lorem ipsum 1" },
      { url: "/", text: "Lorem ipsum 2" },
      { url: "/", text: "Lorem ipsum 3" },
      { url: "/", text: "Lorem ipsum 4" },
    ],
  },
};
