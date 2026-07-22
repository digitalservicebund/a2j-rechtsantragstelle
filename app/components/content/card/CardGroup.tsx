import { GridItem } from "~/components/layout/grid/GridItem";
import Card from "./Card";
import type { CardProps } from "./Card";

const spanMap: Record<number, string> = {
  3: "xl:col-span-3",
  4: "xl:col-span-4",
  6: "xl:col-span-6",
  12: "xl:col-span-12",
};

const CardGroup = ({ cards }: { cards: CardProps[] }) => {
  if (!cards.length) return null;

  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 12 }}
      lgColumn={{ start: 1, span: 12 }}
      xlColumn={{ start: 1, span: 12 }}
    >
      <div className="grid grid-cols-12 gap-16">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`col-span-12 ${spanMap[card.span] ?? "xl:col-span-4"}`}
          >
            <Card {...card} />
          </div>
        ))}
      </div>
    </GridItem>
  );
};

export default CardGroup;
