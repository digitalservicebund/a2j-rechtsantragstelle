import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "~/components/formElements/Button";

const meta = {
  title: "components/Button",
  component: Button,
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
} satisfies Meta<typeof Button>;

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
