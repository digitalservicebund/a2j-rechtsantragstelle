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
      { html: "<p>Lorem ipsum 1 <a href='/'>Link</a></p>" },
      { html: "<p>Lorem ipsum 2 <a href='/'>Link</a></p>" },
    ],
    links: [
      {
        url: "https://digitalservice.bund.de",
        text: "DigitalService",
      },
      { url: "/url1", text: "Lorem ipsum 1" },
      { url: "/url2", text: "Lorem ipsum 2" },
      { url: "/url3", text: "Lorem ipsum 3" },
      { url: "/url4", text: "Lorem ipsum 4" },
    ],
  },
};
