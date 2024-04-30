import type { TileProps } from "./TileGroup";

type Props = Readonly<Pick<TileProps, "tagDescription">>;

const TileTag = ({ tagDescription }: Props) => {
  if (tagDescription) {
    return (
      <span className="bg-blue-300 px-8 py-4 text-blue-800 ds-label-03-bold rounded">
        {tagDescription}
      </span>
    );
  }

  return null;
};

export default TileTag;
