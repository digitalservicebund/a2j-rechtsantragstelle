export type ImageProps = {
  presentational?: boolean;
  data?: {
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
    };
  };
};

function Image({ data, presentational, ...props }: ImageProps) {
  if (!data) return null;

  const imageUrl = data.attributes.url;
  const width = data.attributes.width;
  const height = data.attributes.height;

  const altText = data.attributes.alternativeText || undefined;

  if (!presentational && !altText) {
    console.warn("Missing alt text", imageUrl);
  }

  return (
    <img
      {...props}
      src={imageUrl}
      alt={presentational ? "" : altText}
      width={width}
      height={height}
    />
  );
}

export default Image;
