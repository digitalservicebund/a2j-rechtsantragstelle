import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";
import TelephoneInput from "~/components/kern/formElements/input/TelephoneInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "kern/formElements/input/TelephoneInput",
  component: TelephoneInput,
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
} satisfies Meta<typeof TelephoneInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "telephone-input",
    label: "Telephone Input",
    placeholder: "Enter phone number...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithHelperText: Story = {
  args: {
    name: "telephone-input-helper",
    label: "Telephone Input with Helper",
    placeholder: "Enter phone number...",
    helperText: "Please enter your phone number",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const errorSchema = z.object({
  "telephone-input-error": z.string().min(1, { message: "required" }),
});

export const WithError: Story = {
  args: {
    name: "telephone-input-error",
    label: "Telephone Input with Error",
    placeholder: "This field has an error",
    errorMessages: [{ code: "required", text: "This field is required" }],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, errorSchema)],
};
