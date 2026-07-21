import { GridItem } from "~/components/layout/grid/GridItem";
import Card from "./Card";
import type { CardProps } from "./Card";

const CardGroup = ({ cards }: { cards: CardProps[] }) => {
  if (!cards.length) return null;

  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 12 }}
      lgColumn={{ start: 3, span: 12 }}
      xlColumn={{ start: 3, span: 12 }}
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
