import { type Meta, type StoryObj } from "@storybook/react-vite";
import { KernProgress } from "~/components/kern/KernProgressBar";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernProgress",
  component: KernProgress,
  tags: ["autodocs"],
} satisfies Meta<typeof KernProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 2,
    max: 5,
    fallback: "Fortschrittsbalken",
    label: "Schritt 2 von 5",
  },
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
};
