import { FlowStepperNavigation } from "~/components/navigation/FlowStepperNavigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Container from "~/components/layout/Container";

const meta = {
  title: "Layout/FlowStepperNavigation",
  component: FlowStepperNavigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FlowStepperNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    steppers: [
      {
        label: "Gericht prüfen",
        href: "/gericht-pruefen",
        state: "Current",
      },
      {
        label: "Klage erstellen",
        href: "/klage-erstellen",
        state: "Open",
      },
      {
        label: "Klage herunterladen",
        href: "/klage-herunterladen",
        state: "Disabled",
      },
    ],
  },
  decorators: [
    (Story) => (
      <Container paddingTop="24" paddingBottom="24">
        {Story()}
      </Container>
    ),
  ],
};
