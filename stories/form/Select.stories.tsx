import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import Select from "~/components/formElements/inputs/select/Select";

const meta = {
  title: "form/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "select",
    label: undefined,
    options: [
      { value: "option1", text: "Option 1", preSelected: false },
      { value: "option2", text: "Option 2", preSelected: false },
      { value: "option3", text: "Option 3", preSelected: false },
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
      { value: "berlin", text: "Berlin", preSelected: false },
      { value: "hamburg", text: "Hamburg", preSelected: false },
      { value: "muenchen", text: "München", preSelected: false },
      { value: "koeln", text: "Köln", preSelected: false },
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
    options: [
      {
        value: "baden-wuerttemberg",
        text: "Baden-Württemberg",
        preSelected: false,
      },
      { value: "bayern", text: "Bayern", preSelected: false },
      { value: "berlin", text: "Berlin", preSelected: false },
      { value: "brandenburg", text: "Brandenburg", preSelected: false },
      { value: "bremen", text: "Bremen", preSelected: false },
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
