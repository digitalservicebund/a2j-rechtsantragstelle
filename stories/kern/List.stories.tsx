import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";
import KernList from "~/components/kern/KernList";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import imgUrl from "../assets/Rechtliche_Unterstuetzung.svg?no-inline";

const meta = {
  title: "kern/List",
  component: KernList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <Story />
        </Grid>
      </GridSection>
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
          url: imgUrl,
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
