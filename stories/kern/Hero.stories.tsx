import type { Meta, StoryObj } from "@storybook/react-vite";
import Hero from "~/components/kern/Hero";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernHero",
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
    tagName: "h1",
    look: "ds-heading-01-reg",
  } as const,
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-action-default pt-40 pb-40">
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
  args: {
    ...defaultArgs,
    content: {
      html: "A complete hero section with heading, content and a call-to-action button.",
      className: "ds-heading-03-bold",
    },
  },
};
