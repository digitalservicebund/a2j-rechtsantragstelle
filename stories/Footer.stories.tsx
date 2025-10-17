import type { Meta, StoryObj } from "@storybook/react-vite";
import Footer from "../app/components/layout/Footer";

const meta = {
  title: "Layout/Footer",
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
    categorizedLinks: [
      {
        id: 1,
        title: "Category 1",
        links: [
          { url: "url1", text: "link1" },
          { url: "url1", text: "link1" },
        ],
      },
      {
        id: 1,
        title: "Category 2",
        links: [
          { url: "url2", text: "link1" },
          { url: "url2", text: "link" },
        ],
      },
    ],
  },
};
