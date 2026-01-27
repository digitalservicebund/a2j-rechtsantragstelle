import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import KernSelect from "~/components/kern/formElements/KernSelect";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/formElements/KernSelect",
  component: KernSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "select",
    label: undefined,
    options: [
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" },
      { value: "option3", text: "Option 3" },
    ],
    errorMessages: undefined,
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

export const WithLabel: Story = {
  args: {
    name: "select",
    label: "Wählen Sie eine Option",
    options: [
      { value: "berlin", text: "Berlin" },
      { value: "hamburg", text: "Hamburg" },
      { value: "muenchen", text: "München" },
      { value: "koeln", text: "Köln" },
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
      ),
  ],
};

export const WithPlaceholder: Story = {
  args: {
    name: "select",
    label: "Bundesland",
    placeholder: "Bitte wählen Sie ein Bundesland",
    options: [
      { value: "baden-wuerttemberg", text: "Baden-Württemberg" },
      { value: "bayern", text: "Bayern" },
      { value: "berlin", text: "Berlin" },
      { value: "brandenburg", text: "Brandenburg" },
      { value: "bremen", text: "Bremen" },
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
      ),
  ],
};
