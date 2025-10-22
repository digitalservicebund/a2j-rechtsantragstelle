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
        label: "Weitere Angaben",
        state: "Warning",
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

export const NavigationWithCurrentWarning: Story = {
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
        state: "Done",
      },
      {
        destination: ".",
        label: "Persönliche Daten",
        state: "Done",
      },
      {
        destination: ".",
        label: "Weitere Angaben",
        state: "WarningCurrent",
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

export const MobileWithStepper: Story = {
  args: {
    navItems: [
      {
        destination: ".",
        label: "Start",
        state: "Done",
      },
      {
        destination: "..",
        label: "Forderung",
        state: "Done",
      },
      {
        destination: "...",
        label: "Sachgebiet",
        state: "Done",
      },
      {
        destination: "....",
        label: "Klagende Person",
        state: "Done",
      },
      {
        destination: ".....",
        label: "Beklagte Person",
        state: "DoneCurrent",
      },
    ],
    stepsStepper: [
      {
        href: ".",
        label: "Gericht Prüfen",
        state: "DoneCurrent",
      },
      {
        href: "..",
        label: "Klagen erstellen",
        state: "Open",
      },
      {
        href: "...",
        label: "Klagen herunterladen",
        state: "Warning",
      },
      {
        href: "...",
        label: "Klagen herunterladen 2",
        state: "Disabled",
      },
    ],
  },
  decorators: [(Story) => reactRouterContext(Story)],
};

export const MobileWithStepperCurrentWarning: Story = {
  args: {
    navItems: [
      {
        destination: ".",
        label: "Start",
        state: "Done",
      },
      {
        destination: "..",
        label: "Forderung",
        state: "Done",
      },
      {
        destination: "...",
        label: "Sachgebiet",
        state: "Done",
      },
      {
        destination: "....",
        label: "Klagende Person",
        state: "Done",
      },
      {
        destination: ".....",
        label: "Beklagte Person",
        state: "WarningCurrent",
      },
    ],
    stepsStepper: [
      {
        href: ".",
        label: "Gericht Prüfen",
        state: "WarningCurrent",
      },
      {
        href: "..",
        label: "Klagen erstellen",
        state: "Open",
      },
      {
        href: "...",
        label: "Klagen herunterladen",
        state: "Open",
      },
      {
        href: "...",
        label: "Klagen herunterladen 2",
        state: "Disabled",
      },
    ],
  },
  decorators: [(Story) => reactRouterContext(Story)],
};
