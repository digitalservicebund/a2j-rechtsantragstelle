import type { Meta, StoryObj } from "@storybook/react";
import { Details } from "../app/components/Details";
import { remixContext } from "../.storybook/remixContext";
import Container from "~/components/Container";

const meta = {
  title: "Component/Details",
  component: Details,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Details>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Lorem ipsum dolor sit amet?",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  decorators: [
    (Story) => (
      <Container paddingTop="24" paddingBottom="64">
        {remixContext(Story)}
      </Container>
    ),
  ],
};
