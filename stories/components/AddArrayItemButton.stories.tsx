import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddArrayItemButton } from "~/components/common/AddArrayItemButton";

const meta = {
  title: "components/AddArrayItemButton",
  component: AddArrayItemButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof AddArrayItemButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "#",
    buttonText: "Weiteren Abschnitt hinzufügen",
  },
};

export const WithAdditionalContent: Story = {
  args: {
    href: "#",
    buttonText: "Weiteren Abschnitt hinzufügen",
    additionalContent: <p>Der vorhandene Abschnitt wurde gespeichert.</p>,
  },
};

export const Disabled: Story = {
  args: {
    href: "#",
    buttonText: "Weiteren Abschnitt hinzufügen",
    disabled: true,
  },
};
