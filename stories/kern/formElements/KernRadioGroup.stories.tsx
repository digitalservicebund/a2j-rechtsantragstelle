import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import KernRadioGroup from "~/components/kern/formElements/KernRadioGroup";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/formElements/KernRadioGroup",
  component: KernRadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "input",
    label: undefined,
    options: [
      { value: "ja", text: "Ja" },
      { value: "nein", text: "Nein" },
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
    name: "input",
    label: "Beschriftungstext für die Radio Group",
    options: [
      { value: "ja", text: "Ja" },
      { value: "nein", text: "Nein" },
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
export const WithError: Story = {
  args: {
    name: "input",
    options: [
      { value: "ja", text: "Ja" },
      { value: "nein", text: "Nein" },
    ],
    errorMessages: [
      { code: "required", text: "Dieses Feld ist erforderlich." },
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
