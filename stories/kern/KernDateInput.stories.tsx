import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import KernDateInput from "~/components/kern/formElements/KernDateInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernDateInput",
  component: KernDateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof KernDateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "birthDate",
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem>
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
};
