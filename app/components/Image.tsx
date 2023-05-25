export type ImageProps = {
  data?: {
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
    };
  } | null;
};

function Image({ data, ...props }: ImageProps) {
  if (!data) return null;

  const imageUrl = data.attributes.url;
  const width = data.attributes.width;
  const height = data.attributes.height;
  const altText = data.attributes.alternativeText || "";

  return (
    <img
      {...props}
      src={imageUrl}
      alt={altText}
      width={width}
      height={height}
    />
  );
}

export default Image;
