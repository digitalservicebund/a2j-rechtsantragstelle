import config from "~/services/config";

type ImageProps = {
  image: {
    data: {
      attributes?: {
        url: string;
      };
    };
  };
};

const strapiUrl = "todo"; //config().STRAPI_HOST;

const Image = ({ image }: ImageProps) => {
  if (!image.data) return null;

  const imageUrl = `${strapiUrl}${image.data?.attributes?.url}`;
  return (
    <>
      <pre className="hidden">
        {JSON.stringify(image.data.attributes, null, 2)}
      </pre>
      {image ? <img src={imageUrl} /> : ""}
    </>
  );
};

export default Image;
