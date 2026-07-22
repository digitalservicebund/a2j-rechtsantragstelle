import { type Meta, type StoryObj } from "@storybook/react-vite";
import { type CardGroupItem } from "~/components/content/card/Card";
import CardGroup from "~/components/content/card/CardGroup";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta: Meta<typeof CardGroup> = {
  title: "Components/CardGroup",
  component: CardGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CardGroup>;

const mockCards: CardGroupItem[] = [
  {
    id: "card-1",
    heading: "Card 1",
    title: "Title 1",
    description: "Description card 1",
    buttonLabel: "Button Text",
    span: 4,
  },
  {
    id: "card-2",
    heading: "Card 2",
    title: "Title 2",
    description: "Description card 2",
    buttonLabel: "Button Text",
    span: 4,
  },
  {
    id: "card-3",
    heading: "Card 3",
    title: "Title 3",
    description: "Description card 3",
    buttonLabel: "Button Text",
    span: 4,
  },
  {
    id: "card-4",
    heading: "Card 4",
    title: "Title 4",
    description: "Description card 4",
    buttonLabel: "Button Text",
    span: 4,
  },
  {
    id: "card-5",
    heading: "Card 5",
    title: "Title 5",
    description: "Description card 5",
    buttonLabel: "Button Text",
    span: 4,
  },
  {
    id: "card-6",
    heading: "Card 6",
    title: "Title 6",
    description: "Description card 6",
    buttonLabel: "Button Text",
    span: 4,
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
