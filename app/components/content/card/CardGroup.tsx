import Card from "./Card";
import type { CardGroupItem } from "./Card";

const spanMap: Record<number, string> = {
  3: "xl:col-span-3",
  4: "xl:col-span-4",
  6: "xl:col-span-6",
  12: "xl:col-span-12",
};

const CardGroup = ({ cards }: { cards: CardGroupItem[] }) => {
  if (!cards.length) return null;

  return (
    <div className="grid md:grid-cols-12 grid-cols-10 md:gap-32 gap-20">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`md:col-span-12 col-span-10 ${spanMap[card.span] ?? "xl:col-span-4"}`}
        >
          <Card {...card} />
        </div>
      ))}
    </div>
  );
};

export default CardGroup;
