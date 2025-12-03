import type { Meta, StoryObj } from "@storybook/react-vite";
import HeroWithButton from "~/components/kern/HeroWithButton";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/HeroWithButton",
  component: HeroWithButton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroWithButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
    look: "ds-heading-01-reg",
    className: "!text-black",
  } as const,
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-neutral-050 pt-40 pb-40">
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
  args: {
    ...defaultArgs,
    content: {
      html: "<p>A complete hero section with heading, content and a call-to-action button.</p>",
      className: "!text-black text-lg font-medium",
    },
    button: {
      text: "Get Started",
      href: "#",
      look: "primary",
      size: "medium",
    },
  },
};
