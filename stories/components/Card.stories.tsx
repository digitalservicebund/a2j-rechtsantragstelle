import { type Meta, type StoryObj } from "@storybook/react-vite";
import Card from "~/components/content/card/Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "480px" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    heading: "Card heading",
    title: "Card Title",
    description: "Card description",
    buttonLabel: "Button Text",
  },
};
