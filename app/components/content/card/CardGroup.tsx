import { GridItem } from "~/components/layout/grid/GridItem";
import Card from "./Card";
import type { CardProps } from "./Card";

const CardGroup = ({ cards }: { cards: CardProps[] }) => {
  if (!cards.length) return null;

  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="flex gap-kern-space-default"
    >
      <div className="kern-container">
        <div className="kern-row">
          {cards.map((card) => (
            <div key={card.id} className="kern-col-xl-4 kern-col-sm-12">
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>
    </GridItem>
  );
};

export default CardGroup;
