import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "~/components/formElements/Button";
import ButtonContainer from "~/components/formElements/ButtonContainer";

const meta = {
  title: "components/ButtonContainer",
  component: ButtonContainer,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ButtonContainer>;

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
