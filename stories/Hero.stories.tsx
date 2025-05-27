import type { Meta, StoryObj } from "@storybook/react";
import Hero from "~/components/Hero";

const meta = {
  title: "Content/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1" as "h1",
    look: "default",
  },
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithContent: Story = {
  args: {
    ...defaultArgs,
    content: {
      html: "This is a hero section with some content. It can contain <strong>rich text</strong> content.",
    },
  },
};

export const WithButton: Story = {
  args: {
    ...defaultArgs,
    button: {
      text: "Call to Action",
      href: "#",
      look: "primary",
      size: "medium",
    },
  },
};

export const Complete: Story = {
  args: {
    ...defaultArgs,
    content: {
      html: "A complete hero section with heading, content and a call-to-action button.",
    },
    button: {
      text: "Get Started",
      href: "#",
      look: "primary",
      size: "medium",
    },
  },
};
