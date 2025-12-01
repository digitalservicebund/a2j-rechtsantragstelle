import type { Meta, StoryObj } from "@storybook/react-vite";
import Hero from "~/components/content/Hero";
import KernHero from "~/components/kern/KernHero";

const meta = {
  title: "Content/KernHero",
  component: KernHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernHero>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
    look: "default",
  } as const,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    content: {
      html: "A complete hero section with heading, content and a call-to-action button.",
    },
  },
};
