import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import { TimeInput } from "~/components/formElements/inputs/time/TimeInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { createTimeSchema } from "~/services/validation/timeObject";

const meta = {
  title: "form/inputs/TimeInput",
  component: TimeInput,
  tags: ["autodocs"],
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "time",
    label: "Time",
    helperText: "Beispielsweise: 10:30",
    errorMessages: [
      {
        code: "required",
        text: "Enter a value",
      },
    ],
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
        z.object({ time: createTimeSchema() }),
      ),
  ],
};
