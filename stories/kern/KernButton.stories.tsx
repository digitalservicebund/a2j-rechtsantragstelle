import type { Meta, StoryObj } from "@storybook/react-vite";
import KernButton from "~/components/content/kern/KernButton";

const meta = {
  title: "kern/KernButton",
  component: KernButton,
  tags: ["autodocs"],
  argTypes: {
    look: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof KernButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "Primary Button",
    look: "primary",
  },
};

export const Secondary: Story = {
  args: {
    text: "Secondary Button",
    look: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    text: "Tertiary Button",
    look: "tertiary",
  },
};

export const WithIconLeft: Story = {
  args: {
    text: "Button with Icon",
    look: "primary",
    iconLeft: <span className="kern-icon--home" />,
  },
};

export const WithIconRight: Story = {
  args: {
    text: "Button with Icon",
    look: "primary",
    iconRight: <span className="kern-icon--chevron-right" />,
  },
};

export const FullWidth: Story = {
  args: {
    text: "Full Width Button",
    look: "primary",
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled Button",
    look: "primary",
    disabled: true,
  },
};
