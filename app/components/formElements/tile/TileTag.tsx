export type TileDescriptionProps = {
  readonly tagDescription?: string;
};

const TileTag = ({ tagDescription }: TileDescriptionProps) => {
  if (tagDescription) {
    return (
      <span className="max-h-24 bg-blue-300 px-8 py-4 text-blue-800 ds-label-03-bold rounded-sm">
        {tagDescription}
      </span>
    );
  }

  return null;
};

export default TileTag;
