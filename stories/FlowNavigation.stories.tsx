import { reactRouterContext } from ".storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FlowNavigation from "~/components/navigation/FlowNavigation";

const meta = {
  title: "Layout/FlowNavigation",
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
        state: "Done",
      },
      {
        destination: ".",
        label: "Finanzielle Angaben",
        state: "Current",
      },
      {
        destination: ".",
        label: "Persönliche Daten",
        state: "Open",
      },
      {
        destination: ".",
        label: "Abgabe",
        state: "Disabled",
      },
    ],
  },
  decorators: [(Story) => reactRouterContext(Story)],
};
