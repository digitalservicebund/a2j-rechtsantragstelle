import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonContainer from "../app/components/ButtonContainer";
import Button from "../app/components/Button";

const meta = {
  title: "Button/ButtonContainer",
  component: ButtonContainer,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TwoButtons: Story = {
  args: {
    children: (
      <>
        <Button>Button 1</Button>
        <Button look="secondary">Button 2</Button>
      </>
    ),
  },
};
