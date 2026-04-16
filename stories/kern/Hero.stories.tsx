import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHero from "~/components/kern/KernHero";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernHero",
  component: KernHero,
  tags: ["autodocs"],
} satisfies Meta<typeof KernHero>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
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
      html: "Hero Content",
    },
  },
};
