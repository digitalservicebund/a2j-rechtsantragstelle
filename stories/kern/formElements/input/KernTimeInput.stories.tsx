import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";
import KernTimeInput from "~/components/kern/formElements/input/KernTimeInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "kern/formElements/input/KernTimeInput",
  component: KernTimeInput,
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
} satisfies Meta<typeof KernTimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "time-input",
    label: "Uhrzeit",
    placeholder: "HH:MM",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithHelperText: Story = {
  args: {
    name: "time-input-helper",
    label: "Uhrzeit",
    placeholder: "HH:MM",
    helperText: "Bitte geben Sie die Uhrzeit im Format HH:MM ein",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const errorSchema = z.object({
  "time-input-error": z.string().min(1, { message: "required" }),
});

export const WithError: Story = {
  args: {
    name: "time-input-error",
    label: "Uhrzeit",
    placeholder: "HH:MM",
    errorMessages: [{ code: "required", text: "Dieses Feld ist erforderlich" }],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, errorSchema)],
};
