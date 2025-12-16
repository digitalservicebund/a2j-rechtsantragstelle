import type { Meta, StoryObj } from "@storybook/react-vite";
import KernHeroWithButton from "~/components/kern/KernHeroWithButton";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernHeroWithButton",
  component: KernHeroWithButton,
  tags: ["autodocs"],
} satisfies Meta<typeof KernHeroWithButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
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
      html: "<p>Hero Content</p>",
      className: "!text-black text-lg font-medium",
    },
    button: {
      text: "Hero Button",
      href: "#",
      look: "primary",
      size: "medium",
    },
  },
};
