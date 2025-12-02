import type { Meta, StoryObj } from "@storybook/react-vite";
import KernBreadcrumbs from "~/components/kern/KernBreadcrumbs";
import KernHBreadCrumbs from "~/components/kern/KernHero";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernBreadcrumbs",
  component: KernBreadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof KernBreadcrumbs>;

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
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-neutral-050">
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
  args: {
    ...defaultArgs,
    breadcrumbs: [
      { url: "/beratungshilfe", title: "Beratungshilfe" },
      { url: "/beratungshilfe/vorabcheck", title: "Vorab-Check" },
    ],
  },
};
