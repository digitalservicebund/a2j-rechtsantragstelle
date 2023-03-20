import config from "~/services/config";

type ImageProps = {
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
};

const strapiUrl = config().STRAPI_HOST;

const Image = ({ image }: ImageProps) => {
  const imageUrl = `${strapiUrl}${image?.data?.attributes?.url}`;
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
