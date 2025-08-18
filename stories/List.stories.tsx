import type { Meta, StoryObj } from "@storybook/react";
import List from "~/components/content/list/List";
import Background from "../app/components/common/Background";
import Container from "../app/components/layout/Container";
import { faker } from "@faker-js/faker";

const meta = {
  title: "Content/List",
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
    variant: "unordered",
    heading: {
      text: "This is a heading text for list",
      tagName: "h2",
      look: "ds-heading-02-reg",
    },
    items: [
      {
        id: 10,
        headline: {
          text: "Custom image override",
          look: "ds-heading-03-reg",
        },
        content: faker.lorem.paragraph(),
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/1_Rechtliche_Unterstuetzung_904342381e.svg",
          alternativeText: "Example SVG marker",
          width: 40,
          height: 40,
        },
      },
      {
        id: 11,
        headline: {
          text: "Unordered styled marker",
          look: "ds-heading-03-reg",
        },
        content: faker.lorem.paragraph(),
      },
    ],
  },
};
