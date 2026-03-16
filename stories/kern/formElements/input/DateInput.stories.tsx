import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import { type Meta, type StoryObj } from "@storybook/react-vite";
import KernDateInput from "~/components/kern/formElements/input/KernDateInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/formElements/input/DateInput",
  component: KernDateInput,
  tags: ["autodocs"],
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
} satisfies Meta<typeof KernDateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "date-input",
    label: "Datum",
    placeholder: "TT.MM.JJJJ",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
