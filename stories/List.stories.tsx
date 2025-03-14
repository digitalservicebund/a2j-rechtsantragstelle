import type { Meta, StoryObj } from "@storybook/react";
import List from "../app/components/List";
import Background from "../app/components/Background";
import Container from "../app/components/Container";
import { faker } from "@faker-js/faker";

const meta = {
  title: "Page/List",
  component: List,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    (Story) => (
      <Background paddingTop="32" paddingBottom="32">
        <Container paddingTop="32" paddingBottom="40">
          <Story />
        </Container>
      </Background>
    ),
  ],
  args: {
    identifier: "default-list-id",
    heading: {
      text: "This is a heading text for list",
      tagName: "h2",
      look: "ds-heading-02-reg",
    },
    items: [
      {
        headline: {
          text: "This is an item headline",
          look: "ds-heading-03-reg",
        },
        content: faker.lorem.paragraph(),
      },
      { content: faker.lorem.paragraph() },
    ],
  },
};
