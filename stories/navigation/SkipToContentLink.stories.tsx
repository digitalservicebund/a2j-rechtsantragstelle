import { reactRouterContext } from "~/../.storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { KernSkipToContentLink } from "~/components/kern/navigation/SkipToContentLink";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "navigation/SkipToContentLink",
  component: KernSkipToContentLink,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>{reactRouterContext(Story)}</GridItem>
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernSkipToContentLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Zum Inhalt springen",
    target: "#main-content",
  },
};
