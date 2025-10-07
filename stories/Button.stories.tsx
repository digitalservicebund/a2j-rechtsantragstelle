import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "../app/components/common/Button";
import HomeOutlinedIcon from "@digitalservicebund/icons/HomeOutlined";

const meta = {
  title: "Common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      table: {
        disable: true,
      },
    },
    iconLeft: {
      table: {
        disable: true,
      },
    },
    iconRight: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    look: "secondary",
    children: "Button",
  },
};

export const Tertiary: Story = {
  args: {
    look: "tertiary",
    children: "Button",
  },
};

export const Ghost: Story = {
  args: {
    look: "ghost",
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    children: "Button",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    children: "Button",
    size: "small",
  },
};

export const IconLeft: Story = {
  args: {
    children: "Button",
    iconLeft: <HomeOutlinedIcon />,
  },
};

export const IconRight: Story = {
  args: {
    children: "Button",
    iconRight: <HomeOutlinedIcon />,
  },
};
