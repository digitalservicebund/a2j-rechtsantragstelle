import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import KernSplitDateInput from "~/components/kern/formElements/input/KernSplitDateInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { createSplitDateSchema } from "~/services/validation/dateObject";

const meta = {
  title: "kern/formElements/input/SplitDateInput",
  component: KernSplitDateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof KernSplitDateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "date",
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <>
          <GridSection>
            <Grid>
              <GridItem>
                <Story />
              </GridItem>
            </Grid>
          </GridSection>
        </>,
        z.object({ date: createSplitDateSchema() })
      ),
  ],
};
