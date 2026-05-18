import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import { ExclusiveCheckboxes } from "~/components/formElements/inputs/exclusiveCheckboxes/ExclusiveCheckboxes";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "form/ExclusiveCheckboxes",
  component: ExclusiveCheckboxes,
  tags: ["autodocs"],
} satisfies Meta<typeof ExclusiveCheckboxes>;

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
