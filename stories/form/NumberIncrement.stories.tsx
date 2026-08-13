import { type Meta, type StoryObj } from "@storybook/react-vite";
import NumberIncrement from "~/components/formElements/inputs/number/NumberIncrement";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { reactRouterFormContext } from "../../.storybook/reactRouterFormContext";
import { z } from "zod";

const meta = {
  title: "form/NumberIncrement",
  component: NumberIncrement,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberIncrement>;

export default meta;

type Story = StoryObj<typeof meta>;

const errorSchema = z.object({
  "error-example": z
    .string()
    .min(2, { message: "required" })
    .max(10, { message: "max" }),
});

export const Default: Story = {
  args: {
    name: "numberIncrement",
    label: "Kinder",
    min: 0,
    max: 20,
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

export const WithSuffix: Story = {
  args: {
    name: "numberIncrement",
    label: "Kinder",
    min: 0,
    max: 20,
    suffix: "- Anzahl",
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

export const WithError: Story = {
  args: {
    name: "error-example",
    label: "Kinder",
    min: 0,
    max: 10,
    errorMessages: [
      {
        code: "required",
        text: "Add at least 10 children",
      },
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
        errorSchema,
      ),
  ],
};
