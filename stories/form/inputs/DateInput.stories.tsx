import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import DateInput from "~/components/formElements/inputs/date/DateInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { createDateInputSchema } from "~/services/validation/dateObject";

const meta = {
  title: "form/inputs/DateInput",
  component: DateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "date",
    isRequired: true,
    label: "Birthday",
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
        z.object({ date: createDateInputSchema() }),
      ),
  ],
};
