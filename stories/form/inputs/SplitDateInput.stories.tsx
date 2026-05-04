import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import SplitDateInput from "~/components/formElements/inputs/date/SplitDateInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { createSplitDateSchema } from "~/services/validation/dateObject";

const meta = {
  title: "form/inputs/SplitDateInput",
  component: SplitDateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitDateInput>;

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
        z.object({ date: createSplitDateSchema() }),
      ),
  ],
};
