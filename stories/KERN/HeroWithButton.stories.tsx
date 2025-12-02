import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHeroWithButton from "~/components/kern/KernHeroWithButton";

const meta = {
  title: "kern/KernHeroWithButton",
  component: KernHeroWithButton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernHeroWithButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
    look: "ds-heading-01-reg",
  } as const,
};

export const Default: Story = {
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
