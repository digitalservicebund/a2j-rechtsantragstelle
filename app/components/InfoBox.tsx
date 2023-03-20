import InfoBoxItem from "~/components/InfoBoxItem";

type InfoBoxProps = {
  items: any[];
  headlineLevel: 2 | 3 | 4 | 5 | 6;
};

const InfoBox = ({ items, headlineLevel }: InfoBoxProps) => {
  return (
    <ul
      className="list-none ds-stack"
      style={{ "--stack-space": "var(--s-xl)" } as React.CSSProperties}
    >
      {items.map((item, index) => (
        <InfoBoxItem {...item} headlineLevel={headlineLevel} key={index} />
      ))}
    </ul>
  );
};

export default InfoBox;
