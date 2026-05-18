import { reactRouterContext } from "~/../.storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { SkipToContentLink } from "~/components/navigation/SkipToContentLink";

const meta = {
  title: "navigation/SkipToContentLink",
  component: SkipToContentLink,
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
} satisfies Meta<typeof SkipToContentLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Zum Inhalt springen",
    target: "#main-content",
  },
};
