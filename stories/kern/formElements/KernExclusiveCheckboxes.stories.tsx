import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import { KernExclusiveCheckboxes } from "~/components/kern/formElements/exclusiveCheckboxes/KernExclusiveCheckboxes";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/formElements/KernExclusiveCheckboxes",
  component: KernExclusiveCheckboxes,
  tags: ["autodocs"],
} satisfies Meta<typeof KernExclusiveCheckboxes>;

export default meta;

type Story = StoryObj<typeof meta>;

const options = ["checkboxOne", "checkboxTwo", "checkboxThree", "none"];

const labels = {
  checkboxOne: "Wohngeld",
  checkboxTwo: "Krankengeld",
  checkboxThree: "Elterngeld",
  none: "Nichts trifft zu",
};

export const Default: Story = {
  args: {
    name: "test",
    options,
    labels,
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
