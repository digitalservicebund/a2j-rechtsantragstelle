import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "kern/formElements/input/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 3, span: 8 }}
            xlColumn={{ start: 3, span: 8 }}
          >
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "number-input",
    label: "Number Input",
    placeholder: "Zahl eingeben...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithStep: Story = {
  args: {
    name: "number-input-step",
    label: "Number Input with Step",
    placeholder: "Zahl eingeben...",
    step: 0.01,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithHelperText: Story = {
  args: {
    name: "number-input-helper",
    label: "Number Input with Helper",
    placeholder: "Zahl eingeben...",
    helperText: "Geben Sie eine Dezimalzahl ein",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const errorSchema = z.object({
  "number-input-error": z.string().min(1, { message: "required" }),
});

export const WithError: Story = {
  args: {
    name: "number-input-error",
    label: "Number Input with Error",
    placeholder: "Dieses Feld hat einen Fehler",
    errorMessages: [{ code: "required", text: "Dieses Feld ist erforderlich" }],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, errorSchema)],
};
