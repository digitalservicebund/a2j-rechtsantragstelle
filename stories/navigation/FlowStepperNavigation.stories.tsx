import { reactRouterContext } from "~/../.storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { FlowStepperNavigation } from "~/components/navigation/FlowStepperNavigation/FlowStepperNavigation";

const meta = {
  title: "navigation/FlowStepperNavigation",
  component: FlowStepperNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-neutral-025 py-24">
        <Grid>
          <GridItem>{reactRouterContext(Story)}</GridItem>
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof FlowStepperNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { label: "Persönliche Daten", href: ".", state: "Done" },
      { label: "Rechtsproblem", href: "..", state: "Current" },
      { label: "Angaben", href: "...", state: "Open" },
      { label: "Abgabe", href: "....", state: "Disabled" },
    ],
  },
};

export const WithWarning: Story = {
  args: {
    steps: [
      { label: "Persönliche Daten", href: ".", state: "Done" },
      { label: "Rechtsproblem", href: "..", state: "Done" },
      { label: "Angaben", href: "...", state: "Warning" },
      { label: "Abgabe", href: "....", state: "Disabled" },
    ],
  },
};

export const WithWarningCurrent: Story = {
  args: {
    steps: [
      { label: "Persönliche Daten", href: ".", state: "Done" },
      { label: "Rechtsproblem", href: "..", state: "Done" },
      { label: "Angaben", href: "...", state: "WarningCurrent" },
      { label: "Abgabe", href: "....", state: "Disabled" },
    ],
  },
};

export const AllDone: Story = {
  args: {
    steps: [
      { label: "Persönliche Daten", href: ".", state: "Done" },
      { label: "Rechtsproblem", href: "..", state: "Done" },
      { label: "Angaben", href: "...", state: "Done" },
      { label: "Abgabe", href: "....", state: "DoneCurrent" },
    ],
  },
};
