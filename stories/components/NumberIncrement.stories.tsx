import { type Meta, type StoryObj } from "@storybook/react-vite";
import NumberIncrement from "~/components/formElements/inputs/number/NumberIncrement";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { reactRouterFormContext } from "../../.storybook/reactRouterFormContext";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";
import { z } from "zod";

const meta = {
  title: "form/NumberIncrement",
  component: NumberIncrement,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberIncrement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "numberIncrement",
    label: "NumberIncrement",
    errorMessages: [
      { code: "required", text: "Please enter a number" },
      { code: "too_low", text: "Number too low" },
      { code: "too_high", text: "Number too high" },
    ],
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
        z.object({ numberIncrement: createNumberIncrementSchema(0, 5) }),
      ),
  ],
};
