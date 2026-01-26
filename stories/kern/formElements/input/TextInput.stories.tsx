import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";
import TextInput from "~/components/kern/formElements/input/TextInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "kern/formElements/input/TextInput",
  component: TextInput,
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
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "text-input",
    label: "Text Input",
    placeholder: "Text hier eingeben...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithHelperText: Story = {
  args: {
    name: "text-input-helper",
    label: "Text Input with Helper",
    placeholder: "Text hier eingeben...",
    helperText: "Dies ist ein Hilfstext",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const errorSchema = z.object({
  "text-input-error": z
    .string()
    .min(1, { message: "required" })
    .max(10, { message: "max" }),
});

export const WithError: Story = {
  args: {
    name: "text-input-error",
    label: "Text Input with Error",
    placeholder: "Dieses Feld hat einen Fehler",
    errorMessages: [
      { code: "required", text: "Dieses Feld ist erforderlich" },
      { code: "max", text: "Maximal 10 Zeichen erlaubt" },
    ],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, errorSchema)],
};
