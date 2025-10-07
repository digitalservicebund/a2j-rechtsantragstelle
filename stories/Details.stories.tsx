import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details } from "../app/components/content/Details";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import Container from "~/components/layout/Container";

const meta = {
  title: "Content/Details",
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
        {reactRouterContext(Story)}
      </Container>
    ),
  ],
};
