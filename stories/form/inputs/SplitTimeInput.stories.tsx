import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import { SplitTimeInput } from "~/components/formElements/inputs/time/SplitTimeInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { createSplitTimeSchema } from "~/services/validation/timeObject";

const meta = {
  title: "form/inputs/SplitTimeInput",
  component: SplitTimeInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitTimeInput>;

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
        z.object({ time: createSplitTimeSchema() }),
      ),
  ],
};
