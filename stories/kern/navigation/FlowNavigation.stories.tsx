import { reactRouterContext } from ".storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FlowNavigation from "~/components/kern/navigation/FlowNavigation";
import { NavigationList } from "~/components/kern/navigation/NavigationList";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/navigation/FlowNavigation",
  component: FlowNavigation,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>{reactRouterContext(Story)}</GridItem>
        </Grid>
      </GridSection>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FlowNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FlowNavigation>
      <NavigationList
        navItems={[
          {
            destination: ".",
            label: "Das Rechtsproblem",
            state: "Done",
          },
          {
            destination: "..",
            label: "Finanzielle Angaben",
            state: "Current",
          },
          {
            destination: "...",
            label: "Persönliche Daten",
            state: "Open",
          },
          {
            destination: "....",
            label: "Weitere Angaben",
            state: "Warning",
          },
          {
            destination: ".....",
            label: "Abgabe",
            state: "Disabled",
          },
        ]}
      />
    </FlowNavigation>
  ),
};

export const WithCurrentWarning: Story = {
  render: () => (
    <FlowNavigation>
      <NavigationList
        navItems={[
          {
            destination: ".",
            label: "Das Rechtsproblem",
            state: "Done",
          },
          {
            destination: "..",
            label: "Finanzielle Angaben",
            state: "Done",
          },
          {
            destination: "...",
            label: "Persönliche Daten",
            state: "Done",
          },
          {
            destination: "....",
            label: "Weitere Angaben",
            state: "WarningCurrent",
          },
          {
            destination: ".....",
            label: "Abgabe",
            state: "Disabled",
          },
        ]}
      />
    </FlowNavigation>
  ),
};

export const WithSubflows: Story = {
  render: () => (
    <FlowNavigation>
      <NavigationList
        navItems={[
          {
            destination: ".",
            label: "Das Rechtsproblem",
            state: "Done",
            subflows: [
              {
                destination: "./subflow1",
                label: "Unterpunkt 1",
                state: "Done",
              },
              {
                destination: "./subflow2",
                label: "Unterpunkt 2",
                state: "Current",
              },
            ],
          },
          {
            destination: "..",
            label: "Finanzielle Angaben",
            state: "Open",
          },
          {
            destination: "...",
            label: "Persönliche Daten",
            state: "Open",
          },
        ]}
      />
    </FlowNavigation>
  ),
};
