import { type Meta, type StoryObj } from "@storybook/react-vite";
import CardGroup from "~/components/content/card/CardGroup";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "Components/CardGroup",
  component: CardGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof CardGroup>;

export default meta;

type Story = StoryObj<typeof CardGroup>;

const mockCards = [
  {
    id: "card-1",
    heading: "Card 1",
    title: "Title 1",
    description: "Description card 1",
    buttonLabel: "Button Text",
  },
  {
    id: "card-2",
    heading: "Card 2",
    title: "Title 2",
    description: "Description card 2",
    buttonLabel: "Button Text",
  },
  {
    id: "card-3",
    heading: "Card 3",
    title: "Title 3",
    description: "Description card 3",
    buttonLabel: "Button Text",
  },
  {
    id: "card-4",
    heading: "Card 4",
    title: "Title 4",
    description: "Description card 4",
    buttonLabel: "Button Text",
  },
  {
    id: "card-5",
    heading: "Card 5",
    title: "Title 5",
    description: "Description card 5",
    buttonLabel: "Button Text",
  },
  {
    id: "card-6",
    heading: "Card 6",
    title: "Title 6",
    description: "Description card 6",
    buttonLabel: "Button Text",
  },
];

export const SixCardsGroup: Story = {
  args: {
    cards: mockCards,
  },
};

export const ThreeCardsGroup: Story = {
  args: {
    cards: mockCards.slice(0, 3),
  },
};
