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
    preline: "Card Preline 1",
    heading: "Card Heading 1",
    description: "Description Card 1",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-1",
  },
  {
    id: "card-2",
    preline: "Card Preline 2",
    heading: "Card Heading 2",
    description: "Description Card 2",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-2",
  },
  {
    id: "card-3",
    preline: "Card Preline 3",
    heading: "Card Heading 3",
    description: "Description Card 3",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-3",
  },
  {
    id: "card-4",
    preline: "Card Preline 4",
    heading: "Card Heading 4",
    description: "Description Card 4",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-4",
  },
  {
    id: "card-5",
    preline: "Card Preline 5",
    heading: "Card Heading 5",
    description: "Description Card 5",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-5",
  },
  {
    id: "card-6",
    preline: "Card Preline 6",
    heading: "Card Heading 6",
    description: "Description Card 6",
    buttonLabel: "Button Text",
    span: 4,
    link: "/link-6",
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
