import type { StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import KernCheckbox from "~/components/kern/formElements/KernCheckbox";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/formElements/KernCheckbox",
  component: KernCheckbox,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    name: "name",
    label: "label",
    required: true,
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
} satisfies StoryObj<typeof meta>;
export default meta;
