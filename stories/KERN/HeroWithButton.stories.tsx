import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHeroWithButton from "~/components/kern/KernHeroWithButton";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "KERN/KernHeroWithButton",
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
