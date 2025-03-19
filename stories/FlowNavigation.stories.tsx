import type { Meta, StoryObj } from "@storybook/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { NavState } from "~/services/navigation/navState";

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
        label: "Zusammenfassung",
        state: NavState.Open,
      },
      {
        destination: ".",
        label: "Abgabe",
        state: NavState.Disabled,
      },
    ],
  },
};
