import type { Meta, StoryObj } from "@storybook/react";
import FlowNavigation, { NavState } from "~/components/FlowNavigation";

const meta = {
  title: "Page/FlowNavigation",
  component: FlowNavigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FlowNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    navItems: [
      {
        destination: ".",
        label: "Grundvoraussetzungen",
        state: NavState.DoneDisabled,
      },
      {
        destination: ".",
        label: "Das Rechtsproblem",
        state: NavState.Done,
      },
      {
        destination: ".",
        label: "Finanzielle Angaben",
        state: NavState.Current,
      },
      {
        destination: ".",
        label: "Persönliche Daten",
        state: NavState.Open,
      },
      {
        destination: ".",
        label: "Abgabe",
        state: NavState.OpenDisabled,
      },
    ],
  },
};
